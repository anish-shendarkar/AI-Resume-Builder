import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GenerateSummaryDto } from './dto/generate-summary.dto';
import { AnalyzeAtsDto } from './dto/analyze-ats.dto';
import { ImproveTextDto } from './dto/improve-text.dto';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

@Injectable()
export class AiService {
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('OPENROUTER_API_KEY');
  }

  // ─────────────────────────────────────────────
  // Internal helper: call OpenRouter
  // ─────────────────────────────────────────────
  private async callOpenRouter(
    messages: { role: string; content: string }[],
    temperature = 0.7,
  ): Promise<string> {
    const response = await axios.post(
      OPENROUTER_URL,
      { model: MODEL, messages, temperature },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.choices[0].message.content as string;
  }

  // ─────────────────────────────────────────────
  // 1. Generate Professional Summary
  // ─────────────────────────────────────────────
  async generateSummary(dto: GenerateSummaryDto): Promise<{ summary: string }> {
    const content = await this.callOpenRouter([
      {
        role: 'system',
        content: 'You are a professional resume writer.',
      },
      {
        role: 'user',
        content: `
Generate a professional resume summary.

Role: ${dto.role}

Skills: ${dto.skills}

Experience: ${dto.experience}
        `.trim(),
      },
    ]);

    return { summary: content };
  }

  // ─────────────────────────────────────────────
  // 2. Analyze ATS Score
  // ─────────────────────────────────────────────
  async analyzeAts(dto: AnalyzeAtsDto): Promise<{
    score: number;
    matchedKeywords: { keyword: string; weight: string; foundIn: string }[];
    missingKeywords: { keyword: string; weight: string }[];
    vagueJDTerms: string[];
    suggestions: string[];
  }> {
    const { resumeData, jobDescription } = dto;

    const resumeText = `
Name: ${resumeData.name}
Role: ${resumeData.role}
Summary: ${resumeData.summary}

Skills:
${resumeData.skills}

Experience:
${resumeData.experience}

Projects:
${resumeData.projects}
    `.trim();

    const systemPrompt = `
You are a strict ATS scoring system. Be conservative — most resumes score 50-75%.
Only give 90%+ if nearly every specific tool, technology, and requirement is explicitly mentioned.

Scoring rules:
1. Extract SPECIFIC technologies, tools, and skills from the JD (e.g. "React", "PostgreSQL", not vague terms like "modern frameworks")
2. If the JD is vague (e.g. "modern web technologies"), look for at least 3 concrete examples in the resume before counting it matched
3. Penalize missing items heavily — each missing HIGH weight keyword costs 8-12 points
4. Do NOT infer or assume. "NestJS experience" does NOT count as "Spring Boot" even if both are backend frameworks
5. Soft matches (e.g. resume says "scalable apps", JD says "scalability") count for 50% of keyword value only

For this specific JD, also flag:
- Vague JD terms that couldn't be properly scored (list them separately)
- Explicit gaps the candidate should address in a cover letter

Return ONLY valid JSON (no markdown fences):
{
  "score": 68,
  "matchedKeywords": [
    { "keyword": "RESTful APIs", "weight": "high", "foundIn": "experience + projects" },
    { "keyword": "Docker", "weight": "medium", "foundIn": "projects" }
  ],
  "missingKeywords": [
    { "keyword": "GraphQL", "weight": "medium" },
    { "keyword": "automated testing", "weight": "high" }
  ],
  "vagueJDTerms": [
    "modern web technologies",
    "modern frameworks"
  ],
  "suggestions": [
    "JD mentions GraphQL — add it if you have experience",
    "No testing mentioned (Jest, Cypress etc.) — JD explicitly requires it",
    "Add metrics to your bullets: response times, user counts, uptime"
  ]
}
    `.trim();

    const raw = await this.callOpenRouter(
      [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
        },
      ],
      0, // low temperature for consistent scores
    );

    // Parse and validate the response
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (typeof parsed.score !== 'number') {
        throw new Error('Invalid ATS response: missing score');
      }

      return {
        score: parsed.score,
        matchedKeywords: parsed.matchedKeywords ?? [],
        missingKeywords: parsed.missingKeywords ?? [],
        vagueJDTerms: parsed.vagueJDTerms ?? [],
        suggestions: parsed.suggestions ?? [],
      };
    } catch (e) {
      console.error('ATS parse error:', e);
      throw new InternalServerErrorException(
        'Failed to parse ATS response from AI model.',
      );
    }
  }

  // ─────────────────────────────────────────────
  // 3. Improve Resume Text (bullet points)
  // ─────────────────────────────────────────────
  async improveText(dto: ImproveTextDto): Promise<{ improved: string }> {
    const content = await this.callOpenRouter([
      {
        role: 'system',
        content: `
Rewrite resume bullet points professionally.

Use:
- action verbs
- quantified impact
- ATS-friendly wording
        `.trim(),
      },
      {
        role: 'user',
        content: dto.text,
      },
    ]);

    return { improved: content };
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';
let AiService = class AiService {
    configService;
    apiKey;
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.getOrThrow('OPENROUTER_API_KEY');
    }
    async callOpenRouter(messages, temperature = 0.7) {
        const response = await axios_1.default.post(OPENROUTER_URL, { model: MODEL, messages, temperature }, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.choices[0].message.content;
    }
    async generateSummary(dto) {
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
    async analyzeAts(dto) {
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
        const raw = await this.callOpenRouter([
            { role: 'system', content: systemPrompt },
            {
                role: 'user',
                content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`,
            },
        ], 0);
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
        }
        catch (e) {
            console.error('ATS parse error:', e);
            throw new common_1.InternalServerErrorException('Failed to parse ATS response from AI model.');
        }
    }
    async improveText(dto) {
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
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map
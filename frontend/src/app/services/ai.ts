import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Ai {
  constructor(private http: HttpClient) { }

  generateSummary(data: any) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.openRouterApiKey}`,
      'Content-Type': 'application/json',
    });
    return this.http.post('https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume writer.'
          },
          {
            role: 'user',
            content:
              `
              Generate a professional resume summary.

              Role: ${data.role}

              Skills: ${data.skills}

              Experience: ${data.experience}
              `
          }
        ]
      },
      { headers }
    );
  }

  analyzeATS(resumeData: any, jobDescription: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.openRouterApiKey}`,
      'Content-Type': 'application/json'
    });

    // Clean separation: build a readable resume string, exclude jobDescription
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

Return ONLY valid JSON:
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

    return this.http.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}`
          }
        ],
        temperature: 0  // low temp = consistent scores across runs
      },
      { headers }
    );
  }

  parseATSResponse(response: any) {
    try {
      const raw = response.choices[0].message.content;
      // Strip markdown code fences if model adds them despite instructions
      const cleaned = raw.replace(/```json|```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('ATS parse failed:', e);
      return null;
    }
  }

  improveText(text: string) {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.openRouterApiKey}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',

        messages: [
          {
            role: 'system',
            content:
              `
            Rewrite resume bullet points professionally.

            Use:
            - action verbs
            - quantified impact
            - ATS-friendly wording
            `
          },

          {
            role: 'user',
            content: text
          }
        ]
      },
      { headers }
    );

  }
}

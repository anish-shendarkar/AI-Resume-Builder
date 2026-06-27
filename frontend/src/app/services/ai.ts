import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface AtsResult {
  score: number;
  matchedKeywords: { keyword: string; weight: string; foundIn: string }[];
  missingKeywords: { keyword: string; weight: string }[];
  vagueJDTerms: string[];
  suggestions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class Ai {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Calls POST /ai/generate-summary on the NestJS backend.
   * Returns { summary: string }
   */
  generateSummary(data: { role: string; skills: string; experience: string }) {
    return this.http.post<{ summary: string }>(
      `${this.apiUrl}/ai/generate-summary`,
      {
        role: data.role,
        skills: data.skills,
        experience: data.experience,
      },
    );
  }

  /**
   * Calls POST /ai/analyze-ats on the NestJS backend.
   * Returns a fully-parsed AtsResult — no client-side JSON parsing needed.
   */
  analyzeATS(resumeData: any, jobDescription: string) {
    return this.http.post<AtsResult>(`${this.apiUrl}/ai/analyze-ats`, {
      resumeData,
      jobDescription,
    });
  }

  /**
   * Calls POST /ai/improve-text on the NestJS backend.
   * Returns { improved: string }
   */
  improveText(text: string) {
    return this.http.post<{ improved: string }>(
      `${this.apiUrl}/ai/improve-text`,
      { text },
    );
  }
}

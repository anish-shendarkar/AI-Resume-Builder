export interface AtsKeyword {
  keyword: string;
  weight: string;
}

export interface AtsMatchedKeyword extends AtsKeyword {
  foundIn: string;
}

export interface ResumeData {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  portfolio: string;
  role: string;
  summary: string;
  skills: string;
  experience: string;
  projects: string;
  jobDescription: string;
  atsScore: number;
  missingKeywords: AtsKeyword[];
  matchedKeywords: AtsMatchedKeyword[];
  vagueJDTerms: string[];
  atsSuggestions: string[];
}
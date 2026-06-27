import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResumeData } from '../models/resume.model';

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private initialData: ResumeData = {
    name: '',
    email: '',
    github: '',
    linkedin: '',
    portfolio: '',
    role: '',
    summary: '',
    skills: '',
    experience: '',
    projects: '',
    jobDescription: '',
    atsScore: 0,
    missingKeywords: [],
    matchedKeywords: [],
    vagueJDTerms: [],
    atsSuggestions: [],
  };

  private resumeData = new BehaviorSubject<ResumeData>(this.initialData);

  resumeData$ = this.resumeData.asObservable();

  updateResume(data: ResumeData) {
    this.resumeData.next(data);
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Ai } from '../../services/ai';
import { ResumeService } from '../../services/resume';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './resume-form.html',
  styleUrls: ['./resume-form.css'],
})
export class ResumeForm {
  formData = {
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
    missingKeywords: [] as { keyword: string; weight: string }[],
    matchedKeywords: [] as { keyword: string; weight: string; foundIn: string }[],
    vagueJDTerms: [] as string[],
    atsSuggestions: [] as string[],
  };

  loading = false;

  constructor(
    private ai: Ai,
    private resumeService: ResumeService,
    private router: Router,
  ) {}

  updateResume() {
    this.resumeService.updateResume(this.formData as any);
  }

  // ─────────────────────────────────────────────
  // Generate AI Summary
  // ─────────────────────────────────────────────
  generateSummary() {
    this.loading = true;

    this.ai.generateSummary(this.formData).subscribe({
      next: (response) => {
        this.formData.summary = response.summary || 'No summary generated';
        this.updateResume();
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        alert('Failed to generate summary. Make sure the backend is running.');
        this.loading = false;
      },
    });
  }

  // ─────────────────────────────────────────────
  // Navigate to ATS Analysis page
  // ─────────────────────────────────────────────
  goToAts() {
    this.updateResume();
    this.router.navigate(['/ats']);
  }

  // ─────────────────────────────────────────────
  // Improve Experience Bullet Points
  // ─────────────────────────────────────────────
  improveExperience() {
    this.loading = true;

    this.ai.improveText(this.formData.experience).subscribe({
      next: (response) => {
        this.formData.experience = response.improved;
        this.updateResume();
        this.loading = false;
      },
      error: () => {
        alert('Failed to improve text. Make sure the backend is running.');
        this.loading = false;
      },
    });
  }
}
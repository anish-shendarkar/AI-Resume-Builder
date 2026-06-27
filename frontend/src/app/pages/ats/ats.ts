import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Ai, AtsResult } from '../../services/ai';
import { ResumeService } from '../../services/resume';
import { ResumeData } from '../../models/resume.model';

@Component({
  selector: 'app-ats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ats.html',
  styleUrls: ['./ats.css'],
})
export class AtsPage implements OnInit {
  resumeData: ResumeData | null = null;
  atsResult: AtsResult | null = null;
  loading = false;
  error = '';

  constructor(
    private ai: Ai,
    private resumeService: ResumeService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.resumeService.resumeData$.subscribe((data) => {
      this.resumeData = data;
    });
    this.analyze();
  }

  analyze() {
    if (!this.resumeData?.jobDescription?.trim()) {
      this.error = 'No job description found. Please go back and paste a job description first.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.atsResult = null;

    this.ai.analyzeATS(this.resumeData, this.resumeData.jobDescription).subscribe({
      next: (result) => {
        this.atsResult = result;
        if (this.resumeData) {
          this.resumeService.updateResume({
            ...this.resumeData,
            atsScore: result.score,
            missingKeywords: result.missingKeywords,
            matchedKeywords: result.matchedKeywords,
            vagueJDTerms: result.vagueJDTerms,
            atsSuggestions: result.suggestions,
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to analyze. Make sure the backend is running.';
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  get scoreColor(): string {
    const score = this.atsResult?.score ?? 0;
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  }

  get scoreLabel(): string {
    const score = this.atsResult?.score ?? 0;
    if (score >= 70) return 'Strong match 🎉';
    if (score >= 40) return 'Moderate — room to improve';
    return 'Low match — significant gaps';
  }

  get circumference(): number {
    return 2 * Math.PI * 52;
  }

  get scoreDashOffset(): number {
    const score = this.atsResult?.score ?? 0;
    return this.circumference - (score / 100) * this.circumference;
  }
}

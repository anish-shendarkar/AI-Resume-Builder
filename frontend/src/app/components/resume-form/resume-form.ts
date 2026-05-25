import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    missingKeywords: []
  };
  loading = false;

  constructor(
    private ai: Ai,
    private resumeService: ResumeService
  ) { }

  async generateSummary() {

    this.loading = true;

    this.ai.generateSummary(this.formData)
      .subscribe({

        next: (response: any) => {

          console.log(response);

          this.formData.summary =
            response?.choices?.[0]?.message?.content || 'No summary generated';
          this.updateResume();
          this.loading = false;
        },

        error: (error) => {
          console.error(error);
          alert('Failed to generate summary');
          this.loading = false;
        }
      });
  }
  async updateResume() {
    this.resumeService.updateResume(this.formData);
  }
  async analyzeATS() {

    this.loading = true;

    this.ai.analyzeATS(this.formData, this.formData.jobDescription)
      .subscribe({

        next: (response: any) => {

          const parsed =
            this.ai.parseATSResponse(response);

          if(!parsed) {

            alert('Failed to analyze ATS');
            this.loading = false;
            return;
          }

          this.formData.atsScore =
            parsed.score;

          this.formData.missingKeywords =
            parsed.missingKeywords;

          this.updateResume();

          this.loading = false;
        },

        error: (err) => {

          console.error(err);

          this.loading = false;
        }

      });
  }
  async improveExperience() {

    this.loading = true;

    this.ai.improveText(
      this.formData.experience
    )
      .subscribe({

        next: (response: any) => {

          this.formData.experience =
            response.choices[0].message.content;

          this.updateResume();

          this.loading = false;
        },

        error: () => {

          this.loading = false;
        }

      });

  }
}
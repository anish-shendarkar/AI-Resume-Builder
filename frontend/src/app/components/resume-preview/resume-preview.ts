import { Component } from '@angular/core';
import { ResumeService } from '../../services/resume';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-preview.html',
  styleUrls: ['./resume-preview.css']
})
export class ResumePreview {

  resumeData: any;

  constructor(
    private resumeService: ResumeService
  ) {

    this.resumeService.resumeData$
      .subscribe((data: any) => {

        this.resumeData = data;

      });

  }
}
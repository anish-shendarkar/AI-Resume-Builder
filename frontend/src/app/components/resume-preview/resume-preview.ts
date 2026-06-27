import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef,
} from '@angular/core';
import { ResumeService } from '../../services/resume';
import { CommonModule } from '@angular/common';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-resume-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-preview.html',
  styleUrls: ['./resume-preview.css'],
})
export class ResumePreview implements AfterViewInit {
  @ViewChild('resumeContent') resumeContent!: ElementRef;
  @ViewChild('previewWrapper') previewWrapper!: ElementRef;

  resumeData: any;
  scale = 1;

  /** A4 dimensions in px at 96dpi */
  readonly SHEET_W = 794;
  readonly SHEET_H = 1123;

  constructor(
    private resumeService: ResumeService,
    private cdr: ChangeDetectorRef,
  ) {
    this.resumeService.resumeData$.subscribe((data: any) => {
      this.resumeData = data;
    });
  }

  ngAfterViewInit() {
    this.recalcScale();
  }

  @HostListener('window:resize')
  recalcScale() {
    if (!this.previewWrapper) return;
    const w = this.previewWrapper.nativeElement.offsetWidth;
    this.scale = w / this.SHEET_W;
    this.cdr.detectChanges();
  }

  get wrapperHeight(): number {
    return this.SHEET_H * this.scale;
  }

  /**
   * Parses the skills string into structured categories.
   * Expected input per line: "Category: item1, item2, ..."
   * Falls back to a single raw-text entry if no colons found.
   */
  get parsedSkills(): { label: string; value: string }[] {
    const raw = (this.resumeData?.skills || '').trim();
    if (!raw) return [];

    const lines = raw.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const categories: { label: string; value: string }[] = [];

    for (const line of lines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        categories.push({
          label: line.substring(0, colonIdx).trim(),
          value: line.substring(colonIdx + 1).trim(),
        });
      } else {
        // No colon — treat whole line as unlabelled entry
        categories.push({ label: '', value: line });
      }
    }

    return categories;
  }

  async exportDOCX() {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: this.resumeData.name, bold: true, size: 36 })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: this.resumeData.email }),
                new TextRun({ text: ' | ' }),
                new TextRun({ text: this.resumeData.github }),
                new TextRun({ text: ' | ' }),
                new TextRun({ text: this.resumeData.linkedin }),
              ],
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 26 })],
              spacing: { before: 200, after: 150 },
            }),
            new Paragraph({ text: this.resumeData.summary, spacing: { after: 300 } }),
            new Paragraph({
              children: [new TextRun({ text: 'WORK EXPERIENCE', bold: true, size: 26 })],
              spacing: { before: 200, after: 150 },
            }),
            new Paragraph({
              text: this.resumeData.experience || 'Fresher - Projects and internships demonstrate practical experience.',
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [new TextRun({ text: 'SKILLS', bold: true, size: 26 })],
              spacing: { before: 200, after: 150 },
            }),
            new Paragraph({ text: this.resumeData.skills, spacing: { after: 300 } }),
            new Paragraph({
              children: [new TextRun({ text: 'PROJECTS', bold: true, size: 26 })],
              spacing: { before: 200, after: 150 },
            }),
            new Paragraph({ text: this.resumeData.projects, spacing: { after: 300 } }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'resume.docx');
  }

  async exportPDF() {
    try {
      const element = this.resumeContent.nativeElement;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('resume.pdf');
    } catch (error) {
      console.error(error);
      alert('PDF export failed');
    }
  }
}

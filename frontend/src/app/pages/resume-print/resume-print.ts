import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ResumeService } from '../../services/resume';

import html2canvas from 'html2canvas';

import jsPDF from 'jspdf';

import {
  Document,
  Packer,
  Paragraph,
  TextRun
} from 'docx';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-resume-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-print.html',
  styleUrls: ['./resume-print.css']
})
export class ResumePrint {

  @ViewChild('printContent')
  printContent!: ElementRef;

  resumeData: any;

  constructor(
    private resumeService: ResumeService
  ) {

    this.resumeService.resumeData$
      .subscribe((data: any) => {

        this.resumeData = data;

      });

  }

  async exportPDF() {

    const element =
      this.printContent.nativeElement;

    const canvas =
      await html2canvas(element, {

        scale: 2,

        backgroundColor: '#ffffff'

      });

    const imgData =
      canvas.toDataURL('image/png');

    const pdf =
      new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210;

    const pageHeight = 295;

    const imgHeight =
      (canvas.height * imgWidth)
      / canvas.width;

    let heightLeft =
      imgHeight;

    let position = 0;

    pdf.addImage(
      imgData,
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;

    while (heightLeft > 0) {

      position =
        heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(
        imgData,
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );

      heightLeft -= pageHeight;
    }

    pdf.save('resume.pdf');

  }

  async exportDOCX() {

    const doc = new Document({

      sections: [

        {

          properties: {},

          children: [

            new Paragraph({

              children: [

                new TextRun({

                  text: this.resumeData.name,

                  bold: true,

                  size: 36

                })

              ]

            }),

            new Paragraph({

              text:
                this.resumeData.email

            }),

            new Paragraph({

              children: [

                new TextRun({

                  text:
                    'PROFESSIONAL SUMMARY',

                  bold: true,

                  size: 28

                })

              ]

            }),

            new Paragraph({

              text:
                this.resumeData.summary

            }),

            new Paragraph({

              children: [

                new TextRun({

                  text:
                    'WORK EXPERIENCE',

                  bold: true,

                  size: 28

                })

              ]

            }),

            new Paragraph({

              text:
                this.resumeData.experience

            }),

            new Paragraph({

              children: [

                new TextRun({

                  text:
                    'PROJECTS',

                  bold: true,

                  size: 28

                })

              ]

            }),

            new Paragraph({

              text:
                this.resumeData.projects

            }),

            new Paragraph({

              children: [

                new TextRun({

                  text:
                    'TECHNICAL SKILLS',

                  bold: true,

                  size: 28

                })

              ]

            }),

            new Paragraph({

              text:
                this.resumeData.skills

            })

          ]

        }

      ]

    });

    const blob =
      await Packer.toBlob(doc);

    saveAs(blob, 'resume.docx');

  }

}
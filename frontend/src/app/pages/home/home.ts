import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { ResumeForm } from '../../components/resume-form/resume-form';
import { ResumePreview } from '../../components/resume-preview/resume-preview';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Navbar,
    ResumeForm,
    ResumePreview
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

}
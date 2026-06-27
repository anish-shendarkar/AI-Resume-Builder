import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ResumePrint } from './pages/resume-print/resume-print';
import { AtsPage } from './pages/ats/ats';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'print',
        component: ResumePrint
    },
    {
        path: 'ats',
        component: AtsPage
    }
];
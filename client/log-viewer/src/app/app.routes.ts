import { Routes } from '@angular/router';
import { LogViewerComponent } from './components/log-viewer/log-viewer.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/log',
        pathMatch: 'full',
    },
    {
        path: 'log',
        component: LogViewerComponent
    }
];

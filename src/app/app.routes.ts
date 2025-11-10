import { Routes } from '@angular/router';
import {AccueilComponent} from './auth/accueil/accueil.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth/accueil/accueil.component').then(m => m.AccueilComponent)

  }
];


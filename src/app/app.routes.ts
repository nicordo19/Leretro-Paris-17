import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth/accueil/accueil.component').then(
        (m) => m.AccueilComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-panel.component').then(
        (m) => m.AdminPanelComponent
      ),
  },
];

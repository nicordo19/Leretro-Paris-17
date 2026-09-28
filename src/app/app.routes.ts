import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth/accueil/accueil.component').then(
        (m) => m.AccueilComponent
      ),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./admin/admin-panel.component').then(
        (m) => m.AdminPanelComponent
      ),
  },
];

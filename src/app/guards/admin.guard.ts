import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

/**
 * Garde qui autorise l'accès au back-office uniquement pour les utilisateurs
 * authentifiés via Firebase Auth.
 */
export const adminGuard: CanActivateFn = async () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.currentUser) {
    return true;
  }

  const user = await firstValueFrom(authState(auth));
  return user ? true : router.createUrlTree(['/admin/login']);
};

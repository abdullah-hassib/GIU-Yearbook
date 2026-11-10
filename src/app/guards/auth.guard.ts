
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Already authenticated in Angular's memory
  if (auth.isLoggedIn()) {
    return true;
  }

  // Otherwise, check the existing session cookie
  return auth.checkSession().pipe(
    map(user => {
      return user
        ? true
        : router.createUrlTree(['/login']);
    }),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};

import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    snackBar.open('Please log in to access this page.', 'Close', {
      duration: 3000,
    });
    router.navigate(['/login']);
    return false;
  }
  return true;
}

export const AuthGuardChild: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => AuthGuard(route, state);

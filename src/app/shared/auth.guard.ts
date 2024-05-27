import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Please log in to access this page.', 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}

import {Component} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.snackBar.open(error.error[0].toUpperCase() + error.error.slice(1), 'Close', {
            duration: 3000,
          });
        }
      });
    } else {
      this.snackBar.open('Please correct the errors in the form.', 'Close', {
        duration: 3000,
      });
    }
  }

  get username(): AbstractControl<any, any> | null {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl<any, any> | null {
    return this.loginForm.get('password');
  }
}

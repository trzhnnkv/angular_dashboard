import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {IAuthUser} from "../../../shared/models/user.model";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginComponent implements OnInit, OnDestroy{

  form: FormGroup;
  subscription: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: MatSnackBar,
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })

    this.route.queryParams.subscribe((params: Params) => {
      if (params['accessDenied']) {
        this.toast.open('To get started, log in to the system', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      } else if (params['sessionFailed']) {
        this.toast.open('Please log in again', '', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();

    const user: IAuthUser = {
      username: this.form.value.username,
      password: this.form.value.password,
    }

    this.subscription = this.auth.login(user).subscribe({
        next: () => {
          this.auth.getRoleByUsername(user.username).subscribe(role => {
            this.auth.setRole(role);
            this.router.navigate(['/dashboard']);
          });
        },
        error: error =>
        {
          console.log(error);
          this.toast.open(error, '', {
            duration: 2000,
            verticalPosition: 'top',
          });
          this.form.enable();
        }
      });
  }
}

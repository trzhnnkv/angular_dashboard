import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./pages/login-page/components/login-page.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {DashboardComponent} from "./pages/dashboard/components/dashboard/dashboard.component";
import {HeaderLayoutComponent} from "./shared/layouts/header-layout/header-layout.component";
import {UserDetailedComponent} from "./pages/user-detailed/user-detailed.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HeaderLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user/:id', component: UserDetailedComponent }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AuthGuard } from "./shared/guards/auth.guard";
import { UserDetailsComponent } from "./components/dashboard/user-detailed/user-detailed.component";
import {
  UserNStatisticsTabsComponent
} from "./components/dashboard/user-n-statistics-tabs/user-n-statistics-tabs.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'user/:id', component: UserDetailsComponent },
      { path: '', component: UserNStatisticsTabsComponent, }
    ]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

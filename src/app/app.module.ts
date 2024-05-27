import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxsModule} from '@ngxs/store';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {UserState, ProductState, CartState} from "./shared/app.state";
import {AppComponent} from "./app.component";
import {HttpClientModule} from "@angular/common/http";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {UsersComponent} from "./components/dashboard/users/users.component";
import {StatisticsComponent} from './components/dashboard/statistics/statistics.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserDetailsComponent} from './components/dashboard/user-detailed/user-detailed.component';
import {CanvasJSAngularChartsModule} from "@canvasjs/angular-charts";
import {AddUserDialogComponent} from "./components/dashboard/add-user-dialog/add-user-dialog.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HeaderComponent} from './shared/header/header.component';

import {MaterialModule} from "./material/material.module";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UsersComponent,
    StatisticsComponent,
    UserDetailsComponent,
    AddUserDialogComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxsModule.forRoot([UserState, ProductState, CartState]),
    NgxsLoggerPluginModule.forRoot(),
    RouterOutlet,
    RouterLink,
    AppRoutingModule,
    ReactiveFormsModule,
    CanvasJSAngularChartsModule,
    MaterialModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

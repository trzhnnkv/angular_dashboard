import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule} from "../../app-routing.module";
import { DashboardComponent} from "./components/dashboard/dashboard.component";
import { UsersComponent} from "./components/users/users.component";
import { StatisticsComponent } from './components/statistics/statistics.component';
import {UserService} from "./services/user.service";
import {MaterialModule} from "../../material/material.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
  ],
  exports: [
    DashboardComponent,
  ],
  providers: [UserService],
})
export class DashboardModule { }

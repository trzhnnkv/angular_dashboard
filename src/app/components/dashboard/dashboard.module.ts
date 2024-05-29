import { NgModule } from '@angular/core';
import { UsersComponent } from "./users/users.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { UserDetailsComponent } from "./user-detailed/user-detailed.component";
import { AddUserDialogComponent } from "./add-user-dialog/add-user-dialog.component";
import { HeaderComponent } from "./header/header.component";
import { UserNStatisticsTabsComponent } from "./user-n-statistics-tabs/user-n-statistics-tabs.component";
import { DashboardComponent } from "./dashboard.component";
import { SharedModule } from '../../shared/shared.module';
import { CanvasJSAngularChartsModule } from "@canvasjs/angular-charts";
import { RouterOutlet } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import {SortUsersPipe} from "../../shared/pipes/sort-users.pipe";
import {FilterUsersPipe} from "../../shared/pipes/filter-users.pipe";

@NgModule({
  declarations: [
    UsersComponent,
    StatisticsComponent,
    UserDetailsComponent,
    AddUserDialogComponent,
    HeaderComponent,
    UserNStatisticsTabsComponent,
    DashboardComponent,
  ],
  imports: [
    SharedModule,
    CanvasJSAngularChartsModule,
    RouterOutlet,
    ReactiveFormsModule,
  ],
  exports: [
    DashboardComponent
  ],
  providers: [SortUsersPipe, FilterUsersPipe]
})
export class DashboardModule { }

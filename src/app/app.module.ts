import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login-page/components/login-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/guards/auth.guard';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { HeaderLayoutComponent } from './shared/layouts/header-layout/header-layout.component';
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { MockDataService } from "./shared/services/mock-data.service";
import { UserDetailedComponent } from './pages/user-detailed/user-detailed.component';
import { NgxsModule } from '@ngxs/store';
import { AuthState} from "./shared/state/auth.state";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderLayoutComponent,
    UserDetailedComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      MockDataService, {
        dataEncapsulation: false,
        passThruUnknownUrl: true
      }
    ),
    NgxsModule.forRoot([AuthState]),
    DashboardModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxsModule} from '@ngxs/store';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {AppComponent} from "./app.component";
import {HttpClientModule} from "@angular/common/http";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {LoginComponent} from './components/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SharedModule} from "./shared/shared.module";
import {DashboardModule} from "./components/dashboard/dashboard.module";
import {UserState} from "./core/stores/users/users.state";
import {ProductState} from "./core/stores/products/products.state";
import {CartState} from "./core/stores/carts/carts.state";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
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
    SharedModule,
    DashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAuthUser, IUser } from '../models/user.model';
import { map, Observable, of, tap } from 'rxjs';
import { Router } from "@angular/router";
import { MockDataService } from "./mock-data.service";
import { Store } from '@ngxs/store';
import { SetRole } from "../state/auth.state";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private token: string | null = null;

  constructor(private http: HttpClient,
              private router: Router,
              private mockDataService: MockDataService,
              private store: Store) {
    this.restoreRole();
  }

  login(user: IAuthUser): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('https://fakestoreapi.com/auth/login', user)
      .pipe(
        tap(
          ({ token }) => {
            localStorage.setItem('token', token);
            this.setToken(token);
          }
        )
      );
  }

  getRoleByUsername(username: string): Observable<string | null> {
    const user = this.mockDataService.getUserByUsername(username);
    return of(user ? user.role : null);
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  setRole(role: string | null) {
    if (role) {
      localStorage.setItem('role', role);
    } else {
      localStorage.removeItem('role');
    }
    this.store.dispatch(new SetRole(role));
  }

  getRole() {
    return this.store.select(state => state.auth.role);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.setToken(null);
    this.setRole(null);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  private restoreRole() {
    const role = localStorage.getItem('role');
    if (role) {
      this.store.dispatch(new SetRole(role));
    }
  }
}

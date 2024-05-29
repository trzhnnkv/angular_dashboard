import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, {username, password})
      .pipe(tap(response => {
        localStorage.setItem('token', response.token);
        if (username === 'johnd') {
          localStorage.setItem('role', 'admin');
        } else {
          localStorage.setItem('role', 'user');
        }
      }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }
}

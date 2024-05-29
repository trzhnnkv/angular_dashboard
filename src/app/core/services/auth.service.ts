import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl

  constructor(private http: HttpClient, private router: Router) {
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
        // TODO not good use navigation on login method. it cannot be reused, because always be redirecting to dashboard.
        this.router.navigate(['/dashboard']);
      }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // TODO not good use navigation on login method. it cannot be reused, because always be redirecting to login.
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }
}

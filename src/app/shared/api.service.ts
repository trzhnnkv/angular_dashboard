import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User, Cart, Product} from './app.state';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}/carts`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }
}

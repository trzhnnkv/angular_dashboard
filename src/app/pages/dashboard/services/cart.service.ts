import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICart } from "../../../shared/models/cart.model";

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartsUrl = 'api/carts';

  constructor(private http: HttpClient) {}

  getCarts(): Observable<ICart[]> {
    return this.http.get<ICart[]>(this.cartsUrl);
  }
}

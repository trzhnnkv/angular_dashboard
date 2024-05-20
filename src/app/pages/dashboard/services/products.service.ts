import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {IProduct} from "../../../shared/models/product.model";

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productUrl = 'api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.productUrl);
  }

}

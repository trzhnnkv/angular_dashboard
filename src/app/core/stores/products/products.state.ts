import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { LoadProducts } from './products.actions';
import { Product } from "../../interfaces/product.model";
import { ApiService} from "../../services/api.service";
import { tap } from "rxjs/operators";

export interface ProductStateModel {
  products: Product[];
}

@State<ProductStateModel>({
  name: 'product',
  defaults: {
    products: []
  }
})
@Injectable()
export class ProductState {
  constructor(private apiService: ApiService) {}

  @Selector()
  static products(state: ProductStateModel) {
    return state.products;
  }

  @Action(LoadProducts)
  loadProducts(ctx: StateContext<ProductStateModel>) {
    return this.apiService.getProducts().pipe(
      tap((products) => {
        ctx.patchState({ products });
      })
    );
  }
}

import { Injectable } from '@angular/core';
import {State, Action, StateContext, Selector} from '@ngxs/store';
import {LoadProducts} from './products.actions';
import {Product} from "../../interfaces/product.model";
import {ApiService} from "../../services/api.service";
import {tap} from "rxjs/operators";

export interface ProductStateModel {
  products: Product[];
  loaded: boolean;
}

@State<ProductStateModel>({
  name: 'product',
  defaults: {
    products: [],
    loaded: false
  }
})
@Injectable()
export class ProductState {
  constructor(private apiService: ApiService) {
  }

  @Selector()
  static getProducts(state: ProductStateModel) {
    return state.products;
  }

  @Selector()
  static isLoaded(state: ProductStateModel) {
    return state.loaded;
  }

  @Action(LoadProducts)
  loadProducts(ctx: StateContext<ProductStateModel>) {
    const state = ctx.getState();
    if (state.loaded) {
      return;
    }
    return this.apiService.getProducts().pipe(
      tap((products) => {
        ctx.patchState({products, loaded: true});
      })
    );
  }
}

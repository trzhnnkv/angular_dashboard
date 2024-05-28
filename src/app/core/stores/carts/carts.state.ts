import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { LoadCarts, UpdateProductQuantity } from './carts.actions';
import { Cart } from "../../interfaces/cart.model";
import { ApiService} from "../../services/api.service";
import { tap } from "rxjs/operators";

export interface CartStateModel {
  carts: Cart[];
}

@State<CartStateModel>({
  name: 'carts',
  defaults: {
    carts: []
  }
})
@Injectable()
export class CartState {
  constructor(private apiService: ApiService) {}

  @Selector()
  static getCarts(state: CartStateModel) {
    return state.carts;
  }

  @Selector()
  static getCartsByUserId(state: CartStateModel) {
    return (userId: number) => state.carts.filter(cart => cart.userId === userId);
  }

  @Action(LoadCarts)
  loadCarts(ctx: StateContext<CartStateModel>) {
    return this.apiService.getCarts().pipe(
      tap((carts) => {
        ctx.patchState({ carts });
      })
    );
  }

  @Action(UpdateProductQuantity)
  updateProductQuantity(ctx: StateContext<CartStateModel>, action: UpdateProductQuantity) {
    const state = ctx.getState();
    const carts = state.carts.map(cart => {
      // TODO map can be change to users operators
      if (cart.id === action.cartId && cart.userId === action.userId) {
        cart.products = cart.products.map(product => {
          if (product.productId === action.productId) {
            return { ...product, quantity: action.quantity };
          }
          return product;
        });
      }
      return cart;
    });
    ctx.setState({ ...state, carts });
  }
}


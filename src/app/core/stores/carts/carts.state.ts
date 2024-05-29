import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { LoadCarts, UpdateProductQuantity } from './carts.actions';
import { Cart } from "../../interfaces/cart.model";
import { ApiService } from "../../services/api.service";
import { tap } from "rxjs/operators";
import { patch, updateItem } from '@ngxs/store/operators';

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
  static carts(state: CartStateModel) {
    return state.carts;
  }

  @Selector()
  static cartsByUserId(state: CartStateModel) {
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
    ctx.setState(
      patch({
        carts: updateItem<Cart>(
          cart => cart.id === action.cartId && cart.userId === action.userId,
          patch({
            products: updateItem(
              product => product.productId === action.productId,
              patch({ quantity: action.quantity })
            )
          })
        )
      })
    );
  }
}

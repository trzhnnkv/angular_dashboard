import {State, Action, StateContext, Selector} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {ApiService} from '../services/api.service';
import {tap} from 'rxjs/operators';
import {User} from "../interfaces/user.model";
import {Product} from "../interfaces/product.model";
import {Cart} from "../interfaces/cart.model";

export class LoadUsers {
  static readonly type = '[User] Load Users';
}

export class AddUser {
  static readonly type = '[User] Add User';
  constructor(public user: User) {
  }
}

export class LoadCarts {
  static readonly type = '[Cart] Load Carts';
}

export class UpdateProductQuantity {
  static readonly type = '[Cart] Update Product Quantity';
  constructor(public cartId: number, public userId: number, public productId: number, public quantity: number) {
  }
}

export class LoadProducts {
  static readonly type = '[Product] Load Products';
}

export interface UserStateModel {
  users: User[];
  loaded: boolean;
}

export interface CartStateModel {
  carts: Cart[];
  loaded: boolean;
}

export interface ProductStateModel {
  products: Product[];
  loaded: boolean;
}

// TODO Check ngxs cli (split actions and state)
// TODO split stores to own files
@State<UserStateModel>({
  name: 'user',
  defaults: {
    users: [],
    // TODO для спинера лучше сделать отдельный сервис.
    loaded: false
  }
})
@Injectable()
export class UserState {
  constructor(private apiService: ApiService) {
  }

  @Selector()
  static getUsers(state: UserStateModel) {
    return state.users;
  }

  @Selector()
  static getUserById(state: UserStateModel) {
    return (userId: number) => state.users.find(user => user.id === userId);
  }

  @Selector()
  static isLoaded(state: UserStateModel) {
    return state.loaded;
  }

  @Action(LoadUsers)
  loadUsers(ctx: StateContext<UserStateModel>) {
    const state = ctx.getState();
    // TODO Можно отрефакторить на проверку users
    if (state.loaded) {
      return;
    }
    return this.apiService.getUsers().pipe(
      tap((users) => {
        ctx.patchState({users, loaded: true});
      })
    );
  }

  @Action(AddUser)
  addUser(ctx: StateContext<UserStateModel>, action: AddUser) {
    const state = ctx.getState();
    const newUser: User = {...action.user, id: this.generateId(state.users)};
    const updatedUsers = [...state.users, newUser];
    // TODO Check state operators (ngxs docs)
    ctx.patchState({users: updatedUsers});
    return updatedUsers;
  }

  private generateId(users: User[]): number {
    // TODO Can be refactored
    return users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
  }
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    carts: [],
    loaded: false
  }
})
@Injectable()
export class CartState {
  constructor(private apiService: ApiService) {
  }

  @Selector()
  static getCarts(state: CartStateModel) {
    return state.carts;
  }

  @Selector()
  static getCartsByUserId(state: CartStateModel) {
    return (userId: number) => state.carts.filter(cart => cart.userId === userId);
  }

  @Selector()
  static isLoaded(state: CartStateModel) {
    return state.loaded;
  }

  @Action(LoadCarts)
  loadCarts(ctx: StateContext<CartStateModel>) {
    const state = ctx.getState();
    if (state.loaded) {
      return;
    }
    return this.apiService.getCarts().pipe(
      tap((carts) => {
        ctx.patchState({carts, loaded: true});
      })
    );
  }

  @Action(UpdateProductQuantity)
  updateProductQuantity(ctx: StateContext<CartStateModel>, action: UpdateProductQuantity) {
    const state = ctx.getState();
    // TODO map can be change to state operators
    const carts = state.carts.map(cart => {
      if (cart.id === action.cartId && cart.userId === action.userId) {
        cart.products = cart.products.map(product => {
          if (product.productId === action.productId) {
            return {...product, quantity: action.quantity};
          }
          return product;
        });
      }
      return cart;
    });
    ctx.setState({...state, carts});
  }
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

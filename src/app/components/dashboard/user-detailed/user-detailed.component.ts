import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {User} from "../../../core/interfaces/user.model";
import {Cart} from "../../../core/interfaces/cart.model";
import {Product} from "../../../core/interfaces/product.model";
import {UserState} from "../../../core/stores/users/users.state";
import {CartState} from "../../../core/stores/carts/carts.state";
import {ProductState} from "../../../core/stores/products/products.state";
import {UpdateProductQuantity} from "../../../core/stores/carts/carts.actions";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-detailed.component.html',
  styleUrls: ['./user-detailed.component.css']
})
export class UserDetailsComponent implements OnInit {
  userId: number;
  user$: Observable<User | undefined>;
  userCarts$: Observable<Cart[]>;
  products$: Observable<Product[]>;

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.userId = +this.route.snapshot.params['id'];
    this.user$ = this.store.select(UserState.userById).pipe(
      map(selector => selector(this.userId)),
    );
    this.userCarts$ = this.store.select(CartState.cartsByUserId).pipe(
      map(selector => selector(this.userId)),
    );
    this.products$ = this.store.select(ProductState.products).pipe(
    );
  }

  decreaseQuantity(cartId: number, productId: number, quantity: number) {
    if (quantity > 1) {
      this.store.dispatch(new UpdateProductQuantity(cartId, this.userId, productId, quantity - 1));
    }
  }

  increaseQuantity(cartId: number, productId: number, quantity: number) {
    this.store.dispatch(new UpdateProductQuantity(cartId, this.userId, productId, quantity + 1));
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}

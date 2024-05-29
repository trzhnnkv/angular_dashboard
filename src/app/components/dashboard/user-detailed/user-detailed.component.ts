import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {Observable, Subject} from "rxjs";
import {map, takeUntil} from "rxjs/operators";
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
export class UserDetailsComponent implements OnInit, OnDestroy {
  userId: number;
  user$: Observable<User | undefined>;
  userCarts$: Observable<Cart[]>;
  products$: Observable<Product[]>;
  private destroy$ = new Subject<void>();

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    // TODO use snapshot
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.userId = +params['id'];
      this.user$ = this.store.select(UserState.userById).pipe(
        map(selector => selector(this.userId)),
        //TODO can be remove, if not use subscribe
        takeUntil(this.destroy$)
      );
      this.userCarts$ = this.store.select(CartState.cartsByUserId).pipe(
        map(selector => selector(this.userId)),
        //TODO can be remove, if not use subscribe
        takeUntil(this.destroy$)
      );
      this.products$ = this.store.select(ProductState.products).pipe(
        //TODO can be remove, if not use subscribe
        takeUntil(this.destroy$)
      );
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

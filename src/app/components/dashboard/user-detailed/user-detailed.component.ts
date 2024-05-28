import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from "@ngxs/store";
import {
  Cart,
  CartState, Product,
  ProductState,
  UpdateProductQuantity, User,
  UserState,
} from "../../../core/stores/app.state";
import {Observable, Subscription} from "rxjs";
import {map} from "rxjs/operators";

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
  private subscription: Subscription = new Subscription();

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subscription.add(
      this.route.params.subscribe(params => {
        this.userId = +params['id'];
        this.user$ = this.store.select(UserState.getUserById).pipe(map(selector => selector(this.userId)));
        this.userCarts$ = this.store.select(CartState.getCartsByUserId).pipe(map(selector => selector(this.userId)));
        this.products$ = this.store.select(ProductState.getProducts);
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // TODO split to 2 functions
  updateQuantity(cartId: number, productId: number, quantity: number) {
    if (quantity > 0) {
      this.store.dispatch(new UpdateProductQuantity(cartId, this.userId, productId, quantity));
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}

import {Component, OnInit, OnDestroy} from '@angular/core';
import {Select} from '@ngxs/store';
import {combineLatest, Observable, Subject, takeUntil} from 'rxjs';
import {Cart} from "../../../core/interfaces/cart.model";
import {Product} from "../../../core/interfaces/product.model";
import {User} from "../../../core/interfaces/user.model";
import {CartState} from "../../../core/stores/carts/carts.state";
import {ProductState} from "../../../core/stores/products/products.state";
import {UserState} from "../../../core/stores/users/users.state";

interface ChartData {
  label: string;
  // y - is a value
  y: number;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  @Select(CartState.carts) carts$: Observable<Cart[]>;
  @Select(ProductState.products) products$: Observable<Product[]>;
  @Select(UserState.users) users$: Observable<User[]>;

  productPurchaseRatios: ChartData[] = [];
  userTotalPurchases: ChartData[] = [];
  dailyActiveUsers: ChartData[] = [];

  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    combineLatest([this.carts$, this.products$, this.users$]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([carts, products, users]) => {
      this.calculateProductPurchaseRatios(carts, products);
      this.calculateUserTotalPurchases(users, carts, products);
      this.calculateDailyActiveUsers(carts);
    });
  }

  calculateProductPurchaseRatios(carts: Cart[], products: Product[]) {
    const productCounts: { [key: number]: number } = {};
    carts.forEach(cart => {
      cart.products.forEach(product => {
        if (productCounts[product.productId]) {
          productCounts[product.productId] += product.quantity;
        } else {
          productCounts[product.productId] = product.quantity;
        }
      });
    });

    this.productPurchaseRatios = products.map(product => ({
      label: product.title.length >= 20 ? product.title.slice(0, 20) + "..." : product.title,
      y: productCounts[product.id] || 0
    }));
  }

  calculateUserTotalPurchases(users: User[], carts: Cart[], products: Product[]) {
    this.userTotalPurchases = users.map(user => {
      let totalPurchases = 0;

      carts.forEach(cart => {
        if (cart.userId === user.id) {
          cart.products.forEach(cartProduct => {
            const product = products.find(p => p.id === cartProduct.productId);
            if (product) {
              totalPurchases += product.price * cartProduct.quantity;
            }
          });
        }
      });

      return {
        label: user.username,
        y: totalPurchases
      };
    });
  }

  calculateDailyActiveUsers(carts: Cart[]) {
    const startDate = new Date('2020-03-02T00:00:00.000Z');

    const dates = new Array(7).fill(0).map((_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const userActivity = dates.map(date => {
      const usersID = new Set<number>();
      carts.forEach(cart => {
        if (cart.date.split('T')[0] === date) {
          usersID.add(cart.userId);
        }
      });

      return {
        label: date,
        y: usersID.size
      };
    });

    this.dailyActiveUsers = userActivity.reverse();
  }
}

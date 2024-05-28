import {Component, OnInit, OnDestroy} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {CartState, ProductState, UserState} from '../../../core/stores/app.state';
import {Cart} from "../../../core/interfaces/cart.model";
import {Product} from "../../../core/interfaces/product.model";
import {User} from "../../../core/interfaces/user.model";

interface ChartData {
  label: string;
  y: number;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  @Select(CartState.getCarts) carts$: Observable<Cart[]>;
  @Select(ProductState.getProducts) products$: Observable<Product[]>;
  @Select(UserState.getUsers) users$: Observable<User[]>;

  productsData: ChartData[] = [];
  usersData: ChartData[] = [];
  activeUsersData: ChartData[] = [];

  private subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadData() {
    // TODO combine latest
    const cartsSub = this.carts$.subscribe(carts => {
      const productsSub = this.products$.subscribe(products => {
        const usersSub = this.users$.subscribe(users => {
          this.generateProductsData(carts, products);
          this.generateUsersData(users, carts, products);
          this.generateActiveUsersData(carts);
        });
        this.subscriptions.push(usersSub);
      });
      this.subscriptions.push(productsSub);
    });
    this.subscriptions.push(cartsSub);
  }

  generateProductsData(carts: Cart[], products: Product[]) {
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

    this.productsData = products.map(product => ({
      label: product.title.length >= 20 ? product.title.slice(0, 20) + "..." : product.title,
      // TODO y ;)
      y: productCounts[product.id] || 0
    }));
  }

  generateUsersData(users: User[], carts: Cart[], products: Product[]) {
    this.usersData = users.map(user => {
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

  generateActiveUsersData(carts: Cart[]) {
    const startDate = new Date('2020-03-02T00:00:00.000Z');
    // TODO change 1. new Array(7). 2. keys to fill
    const dates = [...Array(7).keys()].map(i => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const activeUsers = dates.map(date => {
      const usersForDate = new Set<number>();
      carts.forEach(cart => {
        if (cart.date.split('T')[0] === date) {
          usersForDate.add(cart.userId);
        }
      });

      return {
        label: date,
        y: usersForDate.size
      };
    });

    this.activeUsersData = activeUsers.reverse();
  }
}

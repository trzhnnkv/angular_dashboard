import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {LoadUsers} from "./core/stores/users/users.actions";
import {LoadCarts} from "./core/stores/carts/carts.actions";
import {LoadProducts} from "./core/stores/products/products.actions";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new LoadUsers());
    this.store.dispatch(new LoadCarts());
    this.store.dispatch(new LoadProducts());
  }
}

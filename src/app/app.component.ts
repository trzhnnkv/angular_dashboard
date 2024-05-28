import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadCarts, LoadProducts, LoadUsers } from './core/stores/app.state';

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

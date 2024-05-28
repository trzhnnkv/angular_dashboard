import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoadCarts, LoadProducts, LoadUsers } from './shared/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new LoadUsers());
    this.store.dispatch(new LoadCarts());
    this.store.dispatch(new LoadProducts());
  }
}

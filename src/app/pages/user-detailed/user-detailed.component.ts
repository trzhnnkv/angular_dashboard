import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../dashboard/services/user.service";
import {IUser} from "../../shared/models/user.model";
import {Location} from "@angular/common";
import {forkJoin, Observable} from "rxjs";
import {ProductsService} from "../dashboard/services/products.service";
import {CartService} from "../dashboard/services/cart.service";
import {IProduct} from "../../shared/models/product.model";
import {ICart} from "../../shared/models/cart.model";

@Component({
  selector: 'app-user-detailed',
  templateUrl: './user-detailed.component.html',
  styleUrl: './user-detailed.component.css'
})
export class UserDetailedComponent implements OnInit{
  users$: Observable<IUser>;
  products$: Observable<IProduct[]>;
  carts$: Observable<ICart[]>;
  userCart: ICart;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private productsService: ProductsService,
              private cartService: CartService,
              private location: Location) {}

  ngOnInit() {
    this.getUserDetailedInfo();
  }

  getUserDetailedInfo() {
    const id = Number(this.route.snapshot.params['id']);
    this.users$ = this.userService.getUser(id);
    this.products$ = this.productsService.getProducts();
    this.carts$ = this.cartService.getCarts();
  }

  goBack(): void {
    this.location.back();
  }

}

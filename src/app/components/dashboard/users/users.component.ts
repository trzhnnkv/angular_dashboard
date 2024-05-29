import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest, takeUntil, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddUserDialogComponent } from "../add-user-dialog/add-user-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MatSort, Sort } from '@angular/material/sort';
import { AuthService } from "../../../core/services/auth.service";
import { User, UserWithDetails } from "../../../core/interfaces/user.model";
import { Cart } from "../../../core/interfaces/cart.model";
import { Product } from "../../../core/interfaces/product.model";
import { UserState } from "../../../core/stores/users/users.state";
import { CartState } from "../../../core/stores/carts/carts.state";
import { ProductState } from "../../../core/stores/products/products.state";
import { SortUsersPipe } from "../../../shared/pipes/sort-users.pipe";
import { FilterUsersPipe } from "../../../shared/pipes/filter-users.pipe";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  filterValue: string = '';

  @Select(UserState.users) users$: Observable<User[]>;
  @Select(CartState.carts) carts$: Observable<Cart[]>;
  @Select(ProductState.products) products$: Observable<Product[]>;

  usersWithDetails$: Observable<UserWithDetails[]>;
  sortedUsersWithDetails: UserWithDetails[] = [];
  originalUsersWithDetails: UserWithDetails[] = [];
  sortActive: string = '';
  sortDirection: string = '';

  @ViewChild(MatSort) sort: MatSort;

  private destroy$ = new Subject<void>();
  userRole: string | null = '';

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private store: Store,
    private sortUsersPipes: SortUsersPipe,
    private filterUsersPipe: FilterUsersPipe
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadData();

    combineLatest([this.users$, this.carts$, this.products$]).pipe(
      map(([users, carts, products]) => users.length > 0 && carts.length > 0 && products.length > 0),
      takeUntil(this.destroy$)
    ).subscribe(allLoaded => {
      this.loading = !allLoaded;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.usersWithDetails$ = combineLatest([this.users$, this.carts$, this.products$]).pipe(
      map(([users, carts, products]) => {
        return users.map(user => {
          const userCarts = carts.filter(cart => cart.userId === user.id);
          const lastPurchaseDate = userCarts.length ? userCarts[userCarts.length - 1].date : 'No purchases yet';
          const totalPurchases = userCarts.reduce((acc, cart) => {
            return acc + cart.products.reduce((sum, cartProduct) => {
              const product = products.find(p => p.id === cartProduct.productId);
              return sum + (product ? product.price * cartProduct.quantity : 0);
            }, 0);
          }, 0);

          return {
            ...user,
            lastPurchaseDate,
            totalPurchases
          };
        });
      })
    );

    this.usersWithDetails$.subscribe(usersWithDetails => {
      this.sortedUsersWithDetails = usersWithDetails;
      this.originalUsersWithDetails = [...usersWithDetails];
    });
  }

  sortData(sort: Sort) {
    this.sortActive = sort.active;
    this.sortDirection = sort.direction;

    if (!this.sortActive || this.sortDirection === '') {
      this.sortedUsersWithDetails = this.originalUsersWithDetails;
      return;
    }

    this.sortedUsersWithDetails = this.sortUsersPipes.transform(this.originalUsersWithDetails, this.sortActive, this.sortDirection);
  }

  applyFilter(event?: Event) {
    if (event) {
      this.filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    }
    this.sortedUsersWithDetails = this.filterUsersPipe.transform(this.originalUsersWithDetails, this.filterValue);
  }

  openAddUserDialog() {
    this.dialog.open(AddUserDialogComponent);
  }

  navigateToDetails(userId: number) {
    this.router.navigate(['/dashboard/user', userId]);
  }
}

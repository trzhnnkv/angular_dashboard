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
import { LoadUsers } from "../../../core/stores/users/users.actions";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  filterValue: string = '';

  @Select(UserState.getUsers) users$: Observable<User[]>;
  @Select(CartState.getCarts) carts$: Observable<Cart[]>;
  @Select(ProductState.getProducts) products$: Observable<Product[]>;

  usersWithDetails$: Observable<UserWithDetails[]>;
  sortedUsersWithDetails: UserWithDetails[] = [];
  originalUsersWithDetails: UserWithDetails[] = [];

  @ViewChild(MatSort) sort: MatSort;

  private destroy$ = new Subject<void>();
  userRole: string | null = '';

  constructor(public dialog: MatDialog,
              private router: Router,
              private authService: AuthService,
              private store: Store) {}

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
    this.store.dispatch(new LoadUsers());

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
    const data = this.originalUsersWithDetails.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedUsersWithDetails = this.originalUsersWithDetails;
      return;
    }

    // TODO в идеале вынести это в pipe
    this.sortedUsersWithDetails = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compareNames(a.name.firstname, b.name.firstname, isAsc);
        case 'date':
          return compareDates(a.lastPurchaseDate, b.lastPurchaseDate, isAsc);
        case 'total':
          return compare(a.totalPurchases, b.totalPurchases, isAsc);
        default:
          return 0;
      }
    });
  }

  applyFilter(event?: Event) {
    if (event) {
      this.filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    }
    // TODO вынести в pipe
    this.sortedUsersWithDetails = this.originalUsersWithDetails.filter(user => {
      const fullName = `${user.name.firstname} ${user.name.lastname}`.toLowerCase();
      const lastPurchaseDate = user.lastPurchaseDate !== 'No purchases yet' ? new Date(user.lastPurchaseDate).toLocaleDateString().toLowerCase() : 'no purchases yet';
      const totalPurchases = user.totalPurchases.toString().toLowerCase();

      return fullName.includes(this.filterValue) ||
        lastPurchaseDate.includes(this.filterValue) ||
        totalPurchases.includes(this.filterValue);
    });
  }

  openAddUserDialog() {
    this.dialog.open(AddUserDialogComponent);
  }

  navigateToDetails(userId: number) {
    this.router.navigate(['/dashboard/user', userId]);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  if (a < b) return isAsc ? -1 : 1;
  if (a > b) return isAsc ? 1 : -1;
  return 0;
}

function compareNames(a: string, b: string, isAsc: boolean) {
  return a.localeCompare(b) * (isAsc ? 1 : -1);
}

function compareDates(a: string | Date, b: string | Date, isAsc: boolean) {
  const dateA = a === 'No purchases yet' ? new Date(0) : new Date(a);
  const dateB = b === 'No purchases yet' ? new Date(0) : new Date(b);
  if (dateA < dateB) return isAsc ? -1 : 1;
  if (dateA > dateB) return isAsc ? 1 : -1;
  return 0;
}

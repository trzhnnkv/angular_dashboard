import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable, combineLatest, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserState, CartState, ProductState, User, Cart, Product} from '../../../shared/app.state';
import {AddUserDialogComponent} from "../add-user-dialog/add-user-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatSort, Sort} from '@angular/material/sort';
import {AuthService} from "../../../shared/auth.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  filterValue: string = '';

  @Select(UserState.getUsers) usersLoaded$: Observable<User[]>;
  @Select(CartState.getCarts) cartsLoaded$: Observable<Cart[]>;
  @Select(ProductState.getProducts) productsLoaded$: Observable<Product[]>;

  usersWithDetails$: Observable<any[]>;
  sortedUsersWithDetails: any[] = [];
  originalUsersWithDetails: any[] = [];

  @ViewChild(MatSort) sort: MatSort;

  private subscriptions: Subscription[] = [];
  userRole: string | null = '';

  constructor(public dialog: MatDialog,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadData();
    combineLatest([this.usersLoaded$, this.cartsLoaded$, this.productsLoaded$]).pipe(
      map(([usersLoaded, cartsLoaded, productsLoaded]) => usersLoaded.length > 0 && cartsLoaded.length > 0 && productsLoaded.length > 0),
    ).subscribe(allLoaded => {
      this.loading = !allLoaded;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadData() {
    this.usersWithDetails$ = combineLatest([this.usersLoaded$, this.cartsLoaded$, this.productsLoaded$]).pipe(
      map(([users, carts, products]) => {
        return users.map(user => {
          const userCarts = carts.filter(cart => cart.userId === user.id);
          const lastPurchaseDate = userCarts.length ? userCarts[userCarts.length - 1].date : 'No purchases yet';
          const totalPurchases = userCarts.map(cart =>
            cart.products.map(cartProduct => {
              const product = products.find(p => p.id === cartProduct.productId);
              return product ? product.price * cartProduct.quantity : 0;
            }).reduce((acc, curr) => acc + curr, 0)
          ).reduce((acc, curr) => acc + curr, 0);

          return {
            ...user,
            lastPurchaseDate,
            totalPurchases
          };
        });
      })
    );

    const usersWithDetailsSub = this.usersWithDetails$.subscribe(usersWithDetails => {
      this.sortedUsersWithDetails = usersWithDetails;
      this.originalUsersWithDetails = [...usersWithDetails];
    });

    this.subscriptions.push(usersWithDetailsSub);
  }

  sortData(sort: Sort) {
    const data = this.originalUsersWithDetails.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedUsersWithDetails = this.originalUsersWithDetails;
      return;
    }

    this.sortedUsersWithDetails = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.name.firstname, b.name.firstname, isAsc);
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
    this.router.navigate(['/user', userId]);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareDates(a: string, b: string, isAsc: boolean) {
  const dateA = a === 'No purchases yet' ? new Date(0) : new Date(a);
  const dateB = b === 'No purchases yet' ? new Date(0) : new Date(b);
  return (dateA < dateB ? -1 : 1) * (isAsc ? 1 : -1);
}

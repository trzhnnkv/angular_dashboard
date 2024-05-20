import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { IUser } from "../../../../shared/models/user.model";
import { forkJoin, Observable } from "rxjs";
import { AuthService } from "../../../../shared/services/auth.service";
import { ProductsService } from "../../services/products.service";
import { IProduct } from "../../../../shared/models/product.model";
import { ICart } from "../../../../shared/models/cart.model";
import { CartService } from "../../services/cart.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users$: Observable<IUser[]>;
  products$: Observable<IProduct[]>;
  carts$: Observable<ICart[]>;
  userCarts: any[] = [];
  role: string | null;

  constructor(private userService: UserService,
              private productsService: ProductsService,
              private cartService: CartService,
              private router: Router,
              private auth: AuthService) {}

  ngOnInit() {
    this.users$ = this.userService.getUsers();
    this.auth.getRole().subscribe(role => {
      this.role = role;
    });
    this.products$ = this.productsService.getProducts();
    this.carts$ = this.cartService.getCarts();

    // Подписываемся на несколько потоков (users$, carts$ и products$).
    forkJoin([this.users$, this.carts$, this.products$]).subscribe(
      ([users, carts, products]) => {
        // Создаём массив userCarts, который будет содержать расширенную информацию о каждом пользователе
        this.userCarts = users.map(user => {
          // Находим все корзины, связанные с текущим пользователем
          const userCarts = carts.filter(cart => cart.userId === user.id);

          // Инициализируем переменную для общей суммы покупок пользователя
          let totalAmount = 0;

          // Инициализируем переменную для даты последней покупки
          // Если у пользователя есть корзины, используем дату первой корзины, иначе null
          let lastPurchaseDate = userCarts.length ? new Date(userCarts[0].date) : null;

          // Проходим по каждой корзине пользователя
          userCarts.forEach(cart => {
            // Проходим по каждому продукту в корзине
            cart.products.forEach(product => {
              // Находим данные о продукте по его ID
              const productData = products.find(p => p.id === product.productId);
              if (productData) {
                // Если продукт найден, добавляем его стоимость к общей сумме
                totalAmount += productData.price * product.quantity;
              }
            });

            // Преобразуем дату корзины в объект Date
            const cartDate = new Date(cart.date);
            // Если дата корзины новее текущей последней даты покупки, обновляем lastPurchaseDate
            if (!lastPurchaseDate || cartDate > lastPurchaseDate) {
              lastPurchaseDate = cartDate;
            }
          });

          // Возвращаем объект пользователя, добавляя к нему поля totalAmount и lastPurchaseDate
          return {
            ...user,
            totalAmount, // Общая сумма покупок пользователя
            lastPurchaseDate: lastPurchaseDate ? lastPurchaseDate.toISOString() : '' // Дата последней покупки в формате ISO или пустая строка
          };
        });
      }
    );

  }

  goToUser(userId: string) {
    this.router.navigate(['/user', userId]);
  }
}

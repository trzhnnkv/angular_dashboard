export class LoadCarts {
  static readonly type = '[Cart] Load Carts';
}

export class UpdateProductQuantity {
  static readonly type = '[Cart] Update Product Quantity';
  constructor(public cartId: number, public userId: number, public productId: number, public quantity: number) {
  }
}

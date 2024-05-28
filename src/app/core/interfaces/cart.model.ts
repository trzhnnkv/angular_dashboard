export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartProduct[];
}

export interface CartProduct {
  productId: number;
  quantity: number;
}

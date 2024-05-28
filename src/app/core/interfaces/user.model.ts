export interface User {
  id: number;
  name: {
    firstname: string;
    lastname: string;
  };
  email: string;
  username: string;
  phone: string;
  image?: string;
}

export interface UserWithDetails extends User {
  lastPurchaseDate: string | Date;
  totalPurchases: number;
}

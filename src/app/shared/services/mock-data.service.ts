import { Injectable } from '@angular/core';
import {InMemoryDbService} from "angular-in-memory-web-api";
import {IUser} from "../models/user.model";
import {IProduct} from "../models/product.model";
import {ICart} from "../models/cart.model";

@Injectable({
  providedIn: 'root'
})
export class MockDataService implements InMemoryDbService{

  createDb() {
    const users: IUser[] = [
      {
        id: 1,
        email: "john@gmail.com",
        username: "johnd",
        name: {
          firstname: "john",
          lastname: "doe"
        },
        phone: "1-570-236-7033",
        role: "admin",
      },
      {
        id: 2,
        email: "morrison@gmail.com",
        username: "mor_2314",
        name: {
          firstname: "david",
          lastname: "morrison"
        },
        phone: "1-570-236-7033",
        role: "user",
      },
      {
        id: 3,
        email: "kevin@gmail.com",
        username: "kevinryan",
        name: {
          firstname: "kevin",
          lastname: "ryan"
        },
        phone: "1-567-094-1345",
        role: "user",
      },
      {
        id: 4,
        email: "don@gmail.com",
        username: "donero",
        name: {
          firstname: "don",
          lastname: "romer"
        },
        phone: "1-765-789-6734",
        role: "user",
      },
      {
        id: 5,
        email: "derek@gmail.com",
        username: "derek",
        name: {
          firstname: "derek",
          lastname: "powell"
        },
        phone: "1-956-001-1945",
        role: "user",
      },
      {
        id: 6,
        email: "david_r@gmail.com",
        username: "david_r",
        name: {
          firstname: "david",
          lastname: "russell"
        },
        phone: "1-678-345-9856",
        role: "user",
      },
      {
        id: 7,
        email: "miriam@gmail.com",
        username: "snyder",
        name: {
          firstname: "miriam",
          lastname: "snyder"
        },
        phone: "1-123-943-0563",
        role: "user",
      },
      {
        id: 8,
        email: "william@gmail.com",
        username: "hopkins",
        name: {
          firstname: "william",
          lastname: "hopkins"
        },
        phone: "1-478-001-0890",
        role: "user",
      },
      {
        id: 9,
        email: "kate@gmail.com",
        username: "kate_h",
        name: {
          firstname: "kate",
          lastname: "hale"
        },
        phone: "1-678-456-1934",
        role: "user",
      },
      {
        id: 10,
        email: "jimmie@gmail.com",
        username: "jimmie_k",
        name: {
          firstname: "jimmie",
          lastname: "klein"
        },
        phone: "1-104-001-4567",
        role: "user",
      }
    ];

    const products: IProduct[] = [
      {
        id: 1,
        title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
        price: 109.95,
        count: 120,
      },
      {
        id: 2,
        title: 'Mens Casual Premium Slim Fit T-Shirts',
        price: 22.3,
        count: 259,
      },
      {
        id: 3,
        title: 'Mens Cotton Jacket',
        price: 55.99,
        count: 500,
      },
      {
        id: 4,
        title: 'Mens Casual Slim Fit',
        price: 15.99,
        count: 430,
      },
      {
        id: 5,
        title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
        price: 695,
        count: 400,
      },
      {
        id: 6,
        title: 'Solid Gold Petite Micropave',
        price: 168,
        count: 70,
      },
      {
        id: 7,
        title: 'White Gold Plated Princess',
        price: 9.99,
        count: 400,
      },
      {
        id: 8,
        title: 'Pierced Owl Rose Gold Plated Stainless Steel Double',
        price: 10.99,
        count: 100,
      },
      {
        id: 9,
        title: 'WD 2TB Elements Portable External Hard Drive - USB 3.0',
        price: 64,
        count: 203,
      },
      {
        id: 10,
        title: 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s',
        price: 109,
        count: 470,
      },
      {
        id: 11,
        title: 'Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5',
        price: 109,
        count: 319,
      },
      {
        id: 12,
        title: 'WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive',
        price: 114,
        count: 400,
      },
      {
        id: 13,
        title: 'Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin',
        price: 599,
        count: 250,
      },
      {
        id: 14,
        title: 'Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED',
        price: 999.99,
        count: 140,
      },
      {
        id: 15,
        title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
        price: 56.99,
        count: 235,
      },
      {
        id: 16,
        title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
        price: 29.95,
        count: 340,
      },
      {
        id: 17,
        title: 'Rain Jacket Women Windbreaker Striped Climbing Raincoats',
        price: 39.99,
        count: 679,
      },
      {
        id: 18,
        title: "MBJ Women's Solid Short Sleeve Boat Neck V",
        price: 9.85,
        count: 130,
      },
      {
        id: 19,
        title: "Opna Women's Short Sleeve Moisture",
        price: 7.95,
        count: 146,
      },
      {
        id: 20,
        title: "DANVOUY Womens T Shirt Casual Cotton Short",
        price: 12.99,
        count: 145,
      }
    ];

    const carts: ICart[] = [
      {
        id: 1,
        userId: 1,
        date: '2020-03-02T00:00:00.000Z',
        products: [
          { productId: 1, quantity: 4 },
          { productId: 2, quantity: 1 },
          { productId: 3, quantity: 6 },
        ],
      },
      {
        id: 2,
        userId: 1,
        date: '2020-01-02T00:00:00.000Z',
        products: [
          { productId: 2, quantity: 4 },
          { productId: 1, quantity: 10 },
          { productId: 5, quantity: 2 },
        ],
      },
      {
        id: 3,
        userId: 2,
        date: '2020-03-01T00:00:00.000Z',
        products: [
          { productId: 1, quantity: 2 },
          { productId: 9, quantity: 1 },
        ],
      },
      {
        id: 4,
        userId: 3,
        date: '2020-01-01T00:00:00.000Z',
        products: [
          { productId: 1, quantity: 4 },
        ],
      },
      {
        id: 5,
        userId: 3,
        date: '2020-03-01T00:00:00.000Z',
        products: [
          { productId: 7, quantity: 1 },
          { productId: 8, quantity: 1 },
        ],
      },
      {
        id: 6,
        userId: 4,
        date: '2020-03-01T00:00:00.000Z',
        products: [
          { productId: 10, quantity: 2 },
          { productId: 12, quantity: 3 },
        ],
      },
      {
        id: 7,
        userId: 8,
        date: '2020-03-01T00:00:00.000Z',
        products: [
          { productId: 18, quantity: 1 },
        ],
      },
      {
        id: 8,
        userId: 5,
        date: '2020-02-15T00:00:00.000Z',
        products: [
          { productId: 4, quantity: 3 },
          { productId: 13, quantity: 1 },
        ],
      },
      {
        id: 9,
        userId: 6,
        date: '2020-01-10T00:00:00.000Z',
        products: [
          { productId: 14, quantity: 2 },
        ],
      },
      {
        id: 10,
        userId: 7,
        date: '2020-02-20T00:00:00.000Z',
        products: [
          { productId: 5, quantity: 1 },
          { productId: 16, quantity: 2 },
        ],
      },
      {
        id: 11,
        userId: 9,
        date: '2020-03-03T00:00:00.000Z',
        products: [
          { productId: 17, quantity: 1 },
        ],
      },
      {
        id: 12,
        userId: 10,
        date: '2020-02-28T00:00:00.000Z',
        products: [
          { productId: 6, quantity: 1 },
          { productId: 20, quantity: 3 },
        ],
      },
    ];

    return {users, products, carts};
  }

  getUserByUsername(username: string): IUser | undefined {
    const users = this.createDb().users;
    return users.find(user => user.username === username);
  }

  constructor() { }
}

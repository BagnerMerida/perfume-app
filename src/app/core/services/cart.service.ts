import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { Product } from '../../models/product';
import { CartItem } from '../../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly storageKey = 'perfume_cart';
  private readonly isBrowser: boolean;

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.cartItemsSubject.next(this.getCartFromStorage());
  }

  addToCart(product: Product, quantity: number = 1): void {
    const items = [...this.cartItemsSubject.value];

    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }

    this.saveCart(items);
  }

  removeFromCart(productId: number): void {
    const items = this.cartItemsSubject.value
      .filter(item => item.product.id !== productId);

    this.saveCart(items);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.cartItemsSubject.value
      .reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  private saveCart(items: CartItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    this.cartItemsSubject.next([...items]);
  }

  private getCartFromStorage(): CartItem[] {
    if (!this.isBrowser) {
      return [];
    }

    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  }
}
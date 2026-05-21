import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CartItem } from '../../models/cart-item';
import { CartService } from '../../core/services/cart.service';
import { environment } from '../../../environments/environment';
import { ButtonComponent, QuantitySelectorComponent, EmptyStateComponent } from '../../shared/components';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    ButtonComponent,
    QuantitySelectorComponent,
    EmptyStateComponent
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {

  cartItems: CartItem[] = [];
  totalPrice = 0;
  private destroy$ = new Subject<void>();

  baseUrl = environment.baseUrl;
  shippingThreshold = 100;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        this.totalPrice = this.cartService.getTotal();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get shippingFree(): boolean {
    return this.totalPrice >= this.shippingThreshold;
  }

  get remainingForFreeShipping(): number {
    return Math.max(0, this.shippingThreshold - this.totalPrice);
  }

  get totalWithShipping(): number {
    return this.shippingFree ? this.totalPrice : this.totalPrice + 5.99;
  }

  imageUrl(item: CartItem): string {
    return item.product.mainImageUrl
      ? this.baseUrl + item.product.mainImageUrl
      : 'https://placehold.co/400x400?text=Perfume';
  }

  removeItem(productId: number, productName: string): void {
    this.cartService.removeFromCart(productId);
    this.snackBar.open(`${productName} eliminado del carrito`, 'Cerrar', { duration: 3000 });
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.snackBar.open('Carrito vaciado', 'Cerrar', { duration: 3000 });
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  subtotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }
}

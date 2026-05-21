import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { Product } from '../../../models/product';
import { CartItem } from '../../../models/cart-item';
import { CartService } from '../../../core/services/cart.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product!: Product;

  baseUrl = environment.baseUrl;
  cartItems: CartItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => this.cartItems = items);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get imageUrl(): string {
    return this.product.mainImageUrl
      ? this.baseUrl + this.product.mainImageUrl
      : 'https://placehold.co/400x400?text=Perfume';
  }

  get isOutOfStock(): boolean {
    return this.product.stock === 0;
  }

  get cartItem(): CartItem | undefined {
    return this.cartItems.find(i => i.product.id === this.product.id);
  }

  get isMaxInCart(): boolean {
    return this.cartItem ? this.cartItem.quantity >= this.product.stock : false;
  }

  addToCart(event: Event): void {
    event.stopPropagation();

    if (this.isOutOfStock) {
      this.snackBar.open('Producto sin stock disponible', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.isMaxInCart) {
      this.snackBar.open('Ya tienes la cantidad máxima disponible en el carrito', 'Cerrar', { duration: 3000 });
      return;
    }

    this.cartService.addToCart(this.product);
    this.snackBar.open(`${this.product.name} agregado al carrito`, 'Cerrar', { duration: 3000 });
  }
}

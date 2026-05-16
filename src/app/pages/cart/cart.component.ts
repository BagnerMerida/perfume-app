import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  Math = Math;

  cartItems: CartItem[] = [];
  total = 0;
  baseUrl = environment.baseUrl;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.cartService.cartItems$
      .subscribe(items => {
        this.cartItems = items;
        this.total = this.cartService.getTotal();
      });
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, delta: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + delta);
    }
  }

}

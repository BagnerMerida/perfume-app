import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';
import { OrderRequest } from '../../models/order-request';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  cartItems: CartItem[] = [];
  total = 0;
  loading = false;
  customerName = '';
  phone = '';
  address = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  confirmOrder(): void {
    if (!this.customerName || !this.phone) {
      alert('Nombre y teléfono son obligatorios');
      return;
    }
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const order: OrderRequest = {
      customerName: this.customerName,
      phone: this.phone,
      address: this.address,
      items: this.cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };

    this.loading = true;

    this.orderService.create(order).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.loading = false;
        alert('Pedido creado correctamente');
        this.router.navigate(['/']);
      },

      error: (error) => {
        console.error(error);
        this.loading = false;
        alert(error?.error?.message || 'Error al crear el pedido');
      }
    });
  }

  get isFormValid(): boolean {
    return !!(
      this.customerName.trim() &&
      this.phone.trim() &&
      this.address.trim() &&
      this.cartItems.length > 0
    );
  }
}


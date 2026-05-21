import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';
import { OrderRequest } from '../../models/order-request';
import { ButtonComponent } from '../../shared/components';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ButtonComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  cartItems: CartItem[] = [];
  total = 0;
  loading = false;
  success = false;
  customerName = '';
  phone = '';
  address = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  confirmOrder(): void {
    if (!this.customerName || !this.phone) {
      this.snackBar.open('Nombre y teléfono son obligatorios', 'Cerrar', { duration: 3000 });
      return;
    }
    if (this.cartItems.length === 0) {
      this.snackBar.open('El carrito está vacío', 'Cerrar', { duration: 3000 });
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
        this.success = true;
      },

      error: (error) => {
        console.error(error);
        this.loading = false;
        this.snackBar.open(error?.error?.message || 'Error al crear el pedido', 'Cerrar', { duration: 5000 });
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
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


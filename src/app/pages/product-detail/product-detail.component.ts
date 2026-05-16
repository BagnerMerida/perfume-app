import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {

  product?: Product;
  loading = false;

  baseUrl = environment.baseUrl;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.loadProduct(slug);
    }
  }

  loadProduct(slug: string): void {

    this.loading = true;

    this.productService.findBySlug(slug).subscribe({
      next: (response) => {
        this.product = response;
        this.loading = false;
      },

      error: (error) => {
        console.error(error);
        this.loading = false;
      }

    });

  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product);
    alert('Producto agregado al carrito');
  }
}

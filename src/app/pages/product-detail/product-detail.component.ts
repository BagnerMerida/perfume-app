import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Product } from '../../models/product';
import { CartItem } from '../../models/cart-item';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { environment } from '../../../environments/environment';
import { ProductCardComponent } from '../../shared/components';
import { ButtonComponent, QuantitySelectorComponent } from '../../shared/components';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    ProductCardComponent,
    ButtonComponent,
    QuantitySelectorComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  product?: Product;
  related: Product[] = [];
  qty = 1;
  cartItems: CartItem[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  baseUrl = environment.baseUrl;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => this.cartItems = items);

    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadProduct(slug);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProduct(slug: string): void {
    this.loading = true;
    this.productService.findBySlug(slug).subscribe({
      next: (response) => {
        this.product = response;
        this.loading = false;
        this.loadRelated();
      },
      error: () => this.loading = false
    });
  }

  private loadRelated(): void {
    if (!this.product) return;
    this.productService.findAll().subscribe({
      next: (response) => {
        this.related = response
          .filter(p => p.categoryId === this.product!.categoryId && p.id !== this.product!.id)
          .slice(0, 4);
      }
    });
  }

  get imageUrl(): string {
    if (!this.product?.mainImageUrl) return 'https://placehold.co/600x600?text=Perfume';
    return this.baseUrl + this.product.mainImageUrl;
  }

  get cartItem(): CartItem | undefined {
    return this.cartItems.find(i => i.product.id === this.product?.id);
  }

  get currentInCart(): number {
    return this.cartItem?.quantity ?? 0;
  }

  get maxAddable(): number {
    if (!this.product) return 0;
    return this.product.stock - this.currentInCart;
  }

  get isOutOfStock(): boolean {
    return this.product ? this.product.stock === 0 : true;
  }

  get notes(): string[] {
    const tags: string[] = [];
    if (this.product?.fragranceType) tags.push(this.product.fragranceType);
    if (this.product?.concentration) tags.push(this.product.concentration);
    return tags;
  }

  get genderLabel(): string {
    switch (this.product?.gender) {
      case 'MEN': return 'Hombre';
      case 'WOMEN': return 'Mujer';
      case 'UNISEX': return 'Unisex';
      default: return '';
    }
  }

  goBack(): void {
    window.history.back();
  }

  addToCart(): void {
    if (!this.product || this.isOutOfStock) {
      this.snackBar.open('Producto sin stock disponible', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.qty > this.maxAddable) {
      const msg = this.maxAddable === 0
        ? 'Ya tienes la cantidad máxima en el carrito'
        : `Solo puedes agregar ${this.maxAddable} más`;
      this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
      return;
    }

    this.cartService.addToCart(this.product, this.qty);
    this.snackBar.open(`${this.qty} × ${this.product.name} agregado al carrito`, 'Cerrar', { duration: 3000 });
    this.qty = 1;
  }
}

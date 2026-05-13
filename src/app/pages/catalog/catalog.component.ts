import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../core/services/product.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {

  products: Product[] = [];

  loading = false;

  search = '';

  selectedGender = '';

  baseUrl = environment.baseUrl;

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.findAll().subscribe({
      next: (response) => {
        console.log(response);
        this.products = response;
        this.loading = false;
      },

      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  filterProducts(): void {
    const params: any = {};
    if (this.search) {
      params.search = this.search;
    }

    if (this.selectedGender) {
      params.gender = this.selectedGender;
    }

    this.loading = true;

    this.productService
      .filterProducts(params)
      .subscribe({
        next: response => {
          this.products = response;
          this.loading = false;
        },

        error: error => {
          console.error(error);
          this.loading = false;
        }
      });
  }

  goToProduct(slug: string): void {
    this.router.navigate(['/product', slug]);
  }

}

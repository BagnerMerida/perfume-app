import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../core/services/product.service';
import { BrandService } from '../../core/services/brand.service';
import { CategoryService } from '../../core/services/category.service';
import { Brand } from '../../models/brand';
import { Category } from '../../models/category';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {

  Math = Math;

  allProducts: Product[] = [];
  products: Product[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];

  loading = false;
  search = '';
  selectedBrandId = 0;
  selectedCategoryId = 0;
  minPrice = 0;
  maxPrice = 10000;
  showFilters = false;

  baseUrl = environment.baseUrl;

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadBrands();
    this.loadCategories();

    const searchParam = this.route.snapshot.queryParams['search'];
    if (searchParam) {
      this.search = searchParam;
      this.filterProducts();
    } else {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.findAll().subscribe({
      next: (response) => {
        this.allProducts = response;
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadBrands(): void {
    this.brandService.findAll().subscribe({
      next: response => this.brands = response
    });
  }

  loadCategories(): void {
    this.categoryService.findAll().subscribe({
      next: response => this.categories = response
    });
  }

  applyFilters(): void {
    let filtered = this.allProducts;

    if (this.search) {
      const term = this.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.brandName?.toLowerCase().includes(term)
      );
    }

    if (this.selectedBrandId) {
      const id = Number(this.selectedBrandId);
      if (id > 0) {
        filtered = filtered.filter(p => p.brandId === id);
      }
    }

    if (this.selectedCategoryId) {
      const id = Number(this.selectedCategoryId);
      if (id > 0) {
        filtered = filtered.filter(p => p.categoryId === id);
      }
    }

    if (this.minPrice > 0) {
      filtered = filtered.filter(p => p.price >= this.minPrice);
    }

    if (this.maxPrice < 10000) {
      filtered = filtered.filter(p => p.price <= this.maxPrice);
    }

    this.products = filtered;
  }

  filterProducts(): void {
    if (this.allProducts.length === 0) {
      this.loadProducts();
    } else {
      this.applyFilters();
    }
  }

  onFilterChange(): void {
    this.filterProducts();
  }

  clearSearch(): void {
    this.search = '';
    this.selectedBrandId = 0;
    this.selectedCategoryId = 0;
    this.minPrice = 0;
    this.maxPrice = 10000;
    this.loadProducts();
  }

  goToProduct(slug: string): void {
    this.router.navigate(['/product', slug]);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}

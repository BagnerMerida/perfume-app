import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../core/services/product.service';
import { BrandService } from '../../core/services/brand.service';
import { CategoryService } from '../../core/services/category.service';
import { Brand } from '../../models/brand';
import { Category } from '../../models/category';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProductCardComponent } from '../../shared/components';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink,
    FormsModule,
    MatIconModule,
    ProductCardComponent
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
  selectedGender = '';
  selectedBrandId = 0;
  selectedCategoryId = 0;
  minPrice = 0;
  maxPrice = 10000;
  showFilters = false;

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
    const genderParam = this.route.snapshot.queryParams['gender'];
    if (searchParam) {
      this.search = searchParam;
    }
    if (genderParam) {
      this.selectedGender = genderParam;
    }
    this.loadProducts(this.selectedGender || undefined);
  }

  loadProducts(gender?: string): void {
    this.loading = true;
    const obs = gender
      ? this.productService.findByGender(gender as 'MEN' | 'WOMEN' | 'UNISEX')
      : this.productService.findAll();
    obs.subscribe({
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

  onGenderChange(gender: string): void {
    this.selectedGender = gender;
    this.loadProducts(gender || undefined);
  }

  onFilterChange(): void {
    this.filterProducts();
  }

  clearSearch(): void {
    this.search = '';
    this.selectedGender = '';
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

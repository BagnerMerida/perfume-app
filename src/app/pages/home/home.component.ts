import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment';

type FilterKey = 'featured' | 'new' | 'bestSeller';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  searchTerm = '';

  featuredProducts: Product[] = [];
  newProducts: Product[] = [];
  bestSellerProducts: Product[] = [];

  activeFilter: FilterKey = 'featured';
  scrollIndex = 0;
  itemsPerPage = 4;

  baseUrl = environment.baseUrl;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  search(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/catalog'], { queryParams: { search: this.searchTerm.trim() } });
    }
  }

  ngOnInit(): void {
    this.productService.findFeatured().subscribe({
      next: response => this.featuredProducts = response,
      error: error => console.error(error)
    });
    this.productService.findNewProducts().subscribe({
      next: response => this.newProducts = response,
      error: error => console.error(error)
    });
    this.productService.findBestSellers().subscribe({
      next: response => this.bestSellerProducts = response,
      error: error => console.error(error)
    });
  }

  get sliderProducts(): Product[] {
    switch (this.activeFilter) {
      case 'new': return this.newProducts;
      case 'bestSeller': return this.bestSellerProducts;
      default: return this.featuredProducts;
    }
  }

  get maxScrollIndex(): number {
    return Math.max(0, this.sliderProducts.length - this.itemsPerPage);
  }

  get filterIndex(): number {
    return this.activeFilter === 'featured' ? 0 : this.activeFilter === 'new' ? 1 : 2;
  }

  get atStart(): boolean {
    return this.scrollIndex <= 0;
  }

  get atEnd(): boolean {
    return this.scrollIndex >= this.maxScrollIndex;
  }

  setFilter(filter: FilterKey): void {
    this.activeFilter = filter;
    this.scrollIndex = 0;
  }

  prev(): void {
    this.scrollIndex = Math.max(0, this.scrollIndex - 1);
  }

  next(): void {
    this.scrollIndex = Math.min(this.maxScrollIndex, this.scrollIndex + 1);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}

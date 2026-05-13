import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ProductService } from '../../core/services/product.service';
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  featuredProducts: Product[] = [];

  baseUrl = environment.baseUrl;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService.findFeatured().subscribe({
      next: response => this.featuredProducts = response,
      error: error => console.error(error)
    });
  }
}
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Brand } from '../../models/brand';
import { Category } from '../../models/category';
import { BrandService } from '../../core/services/brand.service';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { ProductImageService } from '../../core/services/product-image.service';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  templateUrl: './admin-product-form.component.html',
  styleUrl: './admin-product-form.component.css'
})
export class AdminProductFormComponent implements OnInit {

  brands: Brand[] = [];

  categories: Category[] = [];

  imagePreview: string | ArrayBuffer | null = null;

  selectedFile?: File;

  product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    concentration: '',
    fragranceType: '',
    gender: 'UNISEX',
    brandId: null,
    categoryId: null,
    featured: false,
    isNew: true,
    bestSeller: false,
    status: 'ACTIVE'
  };

  constructor(
    private brandService: BrandService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private productImageService: ProductImageService
  ) { }

  ngOnInit(): void {
    this.loadBrands();
    this.loadCategories();
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveProduct(): void {
    this.productService.create(this.product).subscribe({
      next: response => {
        if (this.selectedFile) {
          this.productImageService.uploadImage(
            response.id,
            true,
            1,
            this.selectedFile
          ).subscribe({
            next: () => {
              alert('Producto creado correctamente');
            },
            error: error => {
              console.error(error);
              alert('Producto creado pero imagen falló');
            }
          });
        } else {
          alert('Producto creado correctamente');
        }
      },
      error: error => {
        console.error(error);
        alert('Error al guardar producto');
      }
    });
  }

  getSelectedBrandName(): string {
    const brand = this.brands.find(
      item => item.id === this.product.brandId
    );

    return brand ? brand.name : 'Marca';
  }

  get isFormValid(): boolean {
    return !!(
      this.product.name &&
      this.product.brandId &&
      this.product.categoryId &&
      this.product.price > 0 &&
      this.product.stock >= 0
    );
  }
}

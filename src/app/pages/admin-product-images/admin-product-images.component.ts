import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductImage, ProductImageService } from '../../core/services/product-image.service';

@Component({
  selector: 'app-admin-product-images',
  standalone: true,
  imports: [    
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule],
  templateUrl: './admin-product-images.component.html',
  styleUrl: './admin-product-images.component.css'
})
export class AdminProductImagesComponent {

  productId!: number;

  images: ProductImage[] = [];

  selectedFile?: File;

  mainImage = true;

  displayOrder = 1;

  loading = false;

  constructor(
    private productImageService: ProductImageService
  ) {}

  loadImages(): void {
    if (!this.productId) return;
    this.loading = true;
    this.productImageService.findByProduct(this.productId).subscribe({
      next: response => {
        this.images = response;
        this.loading = false;
      },

      error: error => {
        console.error(error);
        this.loading = false;
      }

    });
  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }

  }

  uploadImage(): void {

    if (!this.productId || !this.selectedFile) {
      alert('Debes ingresar producto y seleccionar imagen');
      return;
    }

    this.productImageService.uploadImage(
      this.productId,
      this.mainImage,
      this.displayOrder,
      this.selectedFile

    ).subscribe({

      next: () => {
        alert('Imagen subida correctamente');
        this.selectedFile = undefined;
        this.loadImages();

      },

      error: error => {
        console.error(error);
        alert('Error al subir imagen');
      }
    });

  }

  deleteImage(imageId: number): void {

    if (!confirm('¿Eliminar esta imagen?')) return;
    this.productImageService.deleteImage(imageId).subscribe({

      next: () => this.loadImages(),
      error: error => {
        console.error(error);
        alert('Error al eliminar imagen');

      }

    });

  }

}

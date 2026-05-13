import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductImage {
  id: number;
  imageUrl: string;
  mainImage: boolean;
  displayOrder: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {

  private readonly apiUrl = 'http://localhost:8080/perfume/api/product-images';

  constructor(private http: HttpClient) {}

  findByProduct(productId: number): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(`${this.apiUrl}/product/${productId}`);
  }

  uploadImage(
    productId: number,
    mainImage: boolean,
    displayOrder: number,
    file: File
  ): Observable<ProductImage> {
    const formData = new FormData();

    formData.append('productId', productId.toString());
    formData.append('mainImage', mainImage.toString());
    formData.append('displayOrder', displayOrder.toString());
    formData.append('file', file);

    return this.http.post<ProductImage>(`${this.apiUrl}/upload`, formData);
  }

  updateImage(
    imageId: number,
    mainImage: boolean,
    displayOrder: number,
    file?: File
  ): Observable<ProductImage> {
    const formData = new FormData();

    formData.append('mainImage', mainImage.toString());
    formData.append('displayOrder', displayOrder.toString());

    if (file) {
      formData.append('file', file);
    }

    return this.http.put<ProductImage>(`${this.apiUrl}/${imageId}`, formData);
  }

  deleteImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${imageId}`);
  }
}
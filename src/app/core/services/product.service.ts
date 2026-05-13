import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl = environment.apiUrl + 'products';

  constructor(
    private http: HttpClient
  ) { }

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  findById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  findFeatured(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/featured`);
  }

  findNewProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/new`);
  }

  findBestSellers(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/best-sellers`);
  }

  findByGender(gender: 'MEN' | 'WOMEN' | 'UNISEX'): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/gender/${gender}`);
  }

  filterProducts(params: any) {
    return this.http.get<Product[]>(
      `${this.apiUrl}/filter`,
      { params }
    );
  }

  findBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/slug/${slug}`);
  }

  create(product: any): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

}

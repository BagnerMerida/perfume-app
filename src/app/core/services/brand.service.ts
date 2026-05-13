import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../../models/brand';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class BrandService {

  apiUrl = environment.apiUrl + 'brands';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl);
  }

}
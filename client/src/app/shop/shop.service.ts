import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(private http: HttpClient) { }

  baseUrl = 'https://localhost:5001/api/';

  getProducts(): Observable<Pagination<Product>> {
    return this.http.get<Pagination<Product>>(this.baseUrl + 'products/eager?pageIndex=1&pageSize=50');
  }
}

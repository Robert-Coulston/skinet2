import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';
import { Observable } from 'rxjs';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shipParams';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;

  getProducts(shopParams: ShopParams): Observable<Pagination<Product>> {
    let params = new HttpParams();
    if (shopParams.brandId > 0) {
      params = params.append('brandId', shopParams.brandId);
    }
    if (shopParams.typeId > 0) {
      params = params.append('typeId', shopParams.typeId);
    }
    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber);
    params = params.append('pageSize', shopParams.pageSize);
    if (shopParams.search) { params = params.append('search', shopParams.search); }

    return this.http.get<Pagination<Product>>(
      this.baseUrl + `products/eager`,
      { params }
    );
  }

  getProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + `products/${productId}/eager`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseUrl + 'products/brands');
  }

  getTypes(): Observable<Type[]> {
    return this.http.get<Type[]>(this.baseUrl + 'products/types');
  }
}

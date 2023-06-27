import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';
import { Observable, of, tap } from 'rxjs';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;
  private shopParams: ShopParams = new ShopParams();

  productCache = new Map<string, Pagination<Product>>();

  products: Product[] = [];
  brands: Brand[] | null = [];
  types: Type[] | null = [];
  pagination?: Pagination<Product>;

  getProducts(useCache = true): Observable<Pagination<Product>> {
    if (!useCache) {
      this.productCache = new Map(); //reset the map
    }

    if (this.productCache.size > 0 && useCache) {
      if (this.productCache.has(Object.values(this.shopParams).join('-'))) {
        this.pagination = this.productCache.get(
          Object.values(this.shopParams).join('-')
        );
        if (this.pagination) {
          return of(this.pagination);
        }
      }
    }

    let params = new HttpParams();
    if (this.shopParams.brandId > 0) {
      params = params.append('brandId', this.shopParams.brandId);
    }
    if (this.shopParams.typeId > 0) {
      params = params.append('typeId', this.shopParams.typeId);
    }
    params = params.append('sort', this.shopParams.sort);
    params = params.append('pageIndex', this.shopParams.pageNumber);
    params = params.append('pageSize', this.shopParams.pageSize);
    if (this.shopParams.search) {
      params = params.append('search', this.shopParams.search);
    }

    return this.http
      .get<Pagination<Product>>(this.baseUrl + `products/eager`, { params })
      .pipe(
        tap((response) => {
          this.productCache.set(
            Object.values(this.shopParams).join('-'),
            response
          );
          this.products = response.data
            ? [...this.products, ...response.data]
            : this.products;
          this.pagination = response;
        })
      );
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams(): ShopParams {
    return this.shopParams;
  }

  getProduct(productId: number): Observable<Product> {
    const product = [...this.productCache.values()] // this.products?.find(p => p.id === productId);
      .reduce((acc, paginationResult) => {
        return {
          ...acc,
          ...paginationResult.data!.find((x) => x.id == productId),
        };
      }, {} as Product);
    console.log(product);
    if (Object.keys(product).length !== 0) {
      return of(product);
    }
    return this.http.get<Product>(this.baseUrl + `products/${productId}/eager`);
  }

  getBrands(): Observable<Brand[]> {
    if (this.brands && this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http
      .get<Brand[]>(this.baseUrl + 'products/brands')
      .pipe(tap((b) => (this.brands = b)));
  }

  getTypes(): Observable<Type[]> {
    if (this.types && this.types.length > 0) {
      return of(this.types);
    }
    return this.http
      .get<Type[]>(this.baseUrl + 'products/types')
      .pipe(tap((t) => (this.types = t)));
  }
}

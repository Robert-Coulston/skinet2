import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';
import { ElementRef } from '@angular/core';

export type sortOptionsType =
  | 'Alphabetical'
  | 'Price: Low to High'
  | 'Price: High to Low';

export interface SortOptionsReference {
  name: sortOptionsType;
  value: string;
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, AfterViewInit {
  productPage: Pagination<Product> = {
    pageIndex: 0,
    pageSize: 0,
    count: 0,
    data: null,
  };

  brands: Brand[] = [];
  types: Type[] = [];

  shopParams: ShopParams;
  totalCount = 0;

  @ViewChild('search')
  searchTerm?: ElementRef;

  sortOptions: SortOptionsReference[] = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  ngOnInit(): void {
    this.getData();
  }

  getData = () => {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  };

  getProducts() {
    this.shopService.getProducts().subscribe({
      next: (productPage) => {
        this.productPage = productPage;
        this.totalCount = productPage.count;
      },
      error: (error) => console.log(error),
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: (brands) => {
        this.brands = [{ id: 0, name: 'All' }, ...brands];
      },
      error: (error) => console.log(error),
    });
  }

  getTypes() {
    this.shopService.getTypes().subscribe({
      next: (types) => {
        this.types = [{ id: 0, name: 'All' }, ...types];
      },
      error: (error) => console.log(error),
    });
  }

  onBrandSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    //this.shopParams = {...this.shopParams, brandId: brandId};
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  onSortSelected(event: any) {
    const params = this.shopService.getShopParams();
    params.sort = event.target.value;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  pageChanged(event: number) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.shopParams = params;
      this.getProducts();
    }
  }

  onSearch() {
    let params = this.shopService.getShopParams();
    params.search = this.searchTerm?.nativeElement.value ?? '';
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }
  onSearchInput(event: any) {
    if (event.code == 'Enter') {
      let params = this.shopService.getShopParams();
      params.pageNumber = 1;
      params.search = this.searchTerm?.nativeElement.value ?? '';
      this.shopService.setShopParams(params);
      this.shopParams = params;
      this.getProducts();
    }
  }

  onReset() {
    this.totalCount = 0;
    this.searchTerm!.nativeElement.value = '';
    const params = new ShopParams();
    this.shopService.setShopParams(params);
    this.shopParams = params;
    this.getProducts();
  }

  constructor(private shopService: ShopService) {
    this.shopParams = this.shopService.getShopParams();
  }
  ngAfterViewInit(): void {}
}

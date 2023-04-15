import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shipParams';
import { ElementRef } from '@angular/core';


export type sortOptionsType = 'Alphabetical' | 'Price: Low to High' | 'Price: High to Low';

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

  shopParams: ShopParams = new ShopParams();
  totalCount = 0;

  @ViewChild('search')
  searchTerm?: ElementRef;

  sortOptions : SortOptionsReference[] = [
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
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (productPage) => {
        this.productPage = productPage;
        this.shopParams.pageNumber = productPage.pageIndex;
        this.shopParams.pageSize = productPage.pageSize;
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
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    //this.shopParams = {...this.shopParams, brandId: brandId};
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(event: any) {
    this.shopParams.sort = event.target.value;
    this.getProducts();
  }

  pageChanged(params: ShopParams) {
    this.shopParams = params;
    this.getProducts();
  }

  onSearch() {
    this.shopParams.search = this.searchTerm?.nativeElement.value ?? '';
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
  onSearchInput(event: any) {
    if (event.code == 'Enter') {
      this.shopParams.pageNumber = 1;
      this.shopParams.search = this.searchTerm?.nativeElement.value ?? '';
      this.getProducts();
    }
  }

  onReset() {
    this.totalCount = 0;
    this.searchTerm!.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }

  constructor(private shopService: ShopService) {}
  ngAfterViewInit(): void {
  }
}

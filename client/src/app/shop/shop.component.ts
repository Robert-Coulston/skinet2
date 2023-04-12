import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';
import { Brand } from '../shared/models/brand';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shipParams';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  productPage: Pagination<Product> = {
    pageIndex: 0,
    pageSize: 0,
    count: 0,
  };

  brands: Brand[] = [];
  types: Type[] = [];

  shopParams: ShopParams = new ShopParams();
  totalCount = 0;

  sortOptions = [
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
      complete: () => console.log('getProducts request completed'),
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: (brands) => {
        this.brands = [{ id: 0, name: 'All' }, ...brands];
      },
      error: (error) => console.log(error),
      complete: () => console.log('getBrands request completed'),
    });
  }

  getTypes() {
    this.shopService.getTypes().subscribe({
      next: (types) => {
        this.types = [{ id: 0, name: 'All' }, ...types];
      },
      error: (error) => console.log(error),
      complete: () => console.log('getTypes request completed'),
    });
  }

  onBrandSelected(brandId: number) {
    this.shopParams.brandId = brandId;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(event: any) {
    this.shopParams.sort = event.target.value;
    this.getProducts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event.page) {
      this.shopParams.pageNumber = event.page;
      this.shopParams.pageSize = event.itemsPerPage;
      this.getProducts();
    }
  }

  constructor(private shopService: ShopService) {}
}

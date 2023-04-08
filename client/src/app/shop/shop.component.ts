import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';
import { Pagination } from '../shared/models/Pagination';
import { Product } from '../shared/models/Product';

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

  ngOnInit(): void {
    this.shopService.getProducts().subscribe({
      next: (productPage) => {
        this.productPage = productPage;
      },
      error: (error) => console.log(error),
      complete: () => console.log('request completed'),
    });
  }

  constructor(private shopService: ShopService) {}
}

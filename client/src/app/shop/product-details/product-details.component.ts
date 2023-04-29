import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/models/Product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.route);
    console.log(this.router);
    this.loadProduct();
  }

  product$: Observable<Product> | null = null;
  product: Product | null = null;

  loadProduct() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.product$ = this.shopService.getProduct(+id);
    }
  }
}

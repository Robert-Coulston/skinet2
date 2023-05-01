import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/models/Product';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumbService.set('@productDetails', ' ');
  }

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
      this.product$.subscribe((p) => {
        this.breadcrumbService.set('@productDetails', p.name);
      });
    }
  }
}

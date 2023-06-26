import { Component, OnInit } from '@angular/core';
import { ShopService } from '../shop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Product } from 'src/app/shared/models/Product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';

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
    private breadcrumbService: BreadcrumbService,
    private basketService: BasketService
  ) {
    this.breadcrumbService.set('@productDetails', ' ');
  }

  quantity = 1;
  quantityInBasket = 0;

  ngOnInit(): void {
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
        this.product = p;
        this.basketService.basketSource$.pipe(take(1)).subscribe({
          next: (basket) => {
            const item = basket?.items.find((x) => x.id === +id);
            if (item) {
              this.quantity = item?.quantity;
              this.quantityInBasket = item?.quantity;
            }
          },
        });
      });
    }
  }

  incrementQuantity() {
    this.quantity++;
  }
  decrementQuantity() {
    this.quantity--;
    if (this.quantity < 0) this.quantity = 0;
  }

  updateBasket() {
    if (this.product !== null) {
      if (this.quantity > this.quantityInBasket) {
        const itemsToAdd = this.quantity - this.quantityInBasket;
        this.quantityInBasket += itemsToAdd;
        this.basketService.addItemToBasket(this.product, itemsToAdd);
      }
      else {
        const itemsToRemove = this.quantityInBasket - this.quantity;
        this.quantityInBasket -= itemsToRemove;
        this.basketService.removeItemFromBasket(this.product.id, itemsToRemove);
      }
    }
  }

  get buttonText(): string {
    return this.quantityInBasket <= 0 ? 'Add to basket' : 'Update basket';
  }
}

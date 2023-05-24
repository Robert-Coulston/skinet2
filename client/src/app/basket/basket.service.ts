import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/Product';

class BasketUtils {
  public static CreateBasketItemFromProduct(product: Product): BasketItem {
    return {
      id: product.id,
      productName: product.name,
      price: product.price,
      quantity: 0,
      pictureUrl: product.pictureUrl,
      brand: product.productBrand,
      type: product.productType,
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  private baseUrl = environment.apiUrl;

  private basketSource = new BehaviorSubject<Basket | null>(null);
  basketSource$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalSource$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) {}

  getBasket(id: string) {
    this.http.get<Basket>(`${this.baseUrl}basket?id=${id}`).subscribe({
      next: (basket) => {
        this.basketSource.next(basket);
        this.basketTotalSource.next(this.calculateTotals());
      },
      complete: () => console.log('complete basket get'),
    });
  }

  setBasket(basket: Basket) {
    this.http.post<Basket>(`${this.baseUrl}basket`, basket).subscribe({
      next: (basket) => {
        this.basketSource.next(basket);
        this.basketTotalSource.next(this.calculateTotals());
      },
      complete: () => console.log('complete basket set'),
    });
  }

  getCurrentBasketValue() {
    return this.basketSource.getValue();
  }

  addItemToBasket(item: Product | BasketItem, quantity = 1) {
    if (this.IsProduct(item)) {
      item = BasketUtils.CreateBasketItemFromProduct(item);
    }
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, item, quantity);

    console.log('Updated basket :', basket);
    this.setBasket(basket);
  }

  removeItemFromBasket(id: number, quantity = 1): void {
    const basket = this.getCurrentBasketValue();
    if (!basket) {
      return;
    }
    const item = basket.items.find((x) => x.id === id);
    if (item) {
      item.quantity -= quantity;
      if (item.quantity <= 0) {
        basket.items = basket.items.filter((x) => x.id !== id);
      }
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: Basket) {
    this.http.delete(`${this.baseUrl}basket?id=${basket.id}`).subscribe({
      next: () => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_Id');
      },
    });
  }

  private addOrUpdateItem(
    items: BasketItem[],
    itemToAdd: BasketItem,
    quantity: number
  ): BasketItem[] {
    const item = items.find((x) => x.id === itemToAdd.id);
    if (item) {
      item.quantity += quantity;
    } else {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }

    console.log('Add or update :', items);
    return items;
  }

  private createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private calculateTotals(): BasketTotals | null {
    const basket = this.getCurrentBasketValue();
    if (!basket) {
      return null;
    }
    const shipping = 0;
    const subtotal = basket.items.reduce((a, b) => {
      return b.price * b.quantity + a;
    }, 0);
    const total = subtotal + shipping;

    const basketTotals: BasketTotals = {
      shipping,
      subtotal,
      total,
    };
    return basketTotals;
  }

  private IsProduct(item: Product | BasketItem): item is Product {
    return (item as Product).productBrand !== undefined;
  }
}

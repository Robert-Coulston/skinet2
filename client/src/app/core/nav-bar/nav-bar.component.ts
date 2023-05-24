import { Component, OnInit } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { BasketItem } from 'src/app/shared/models/basket';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  cartCount = 0;
  constructor(private basketService: BasketService) {}

  ngOnInit(): void {
    this.basketService.basketSource$.subscribe((b) => {
      if (b != null) {
        this.cartCount = this.getCount(b.items);
      }
    });
  }

  getCount(items: BasketItem[]) {
    return items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
  }
}

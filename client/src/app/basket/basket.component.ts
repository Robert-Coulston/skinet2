import { Component, OnInit } from '@angular/core';
import { Observable, catchError, from, map, of } from 'rxjs';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { BasketService } from './basket.service';
import { BasketItem } from '../shared/models/basket';

interface users {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
  constructor(public basketService: BasketService) {}
  ngOnInit(): void {}

  incrementQuantity(item: BasketItem) {
    this.basketService.addItemToBasket(item);
  }

  removeItem(event: {id: number, quantity: number}) {
    this.basketService.removeItemFromBasket(event.id, event.quantity);
  }
}

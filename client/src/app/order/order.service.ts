import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../shared/models/order';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  private baseUrl = environment.apiUrl;

  getOrdersForUser(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl + `orders`);
  }

  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(this.baseUrl + `orders/${orderId}`);
  }
}

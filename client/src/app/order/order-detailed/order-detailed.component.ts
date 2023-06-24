import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/shared/models/order';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss'],
})
export class OrderDetailedComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {
    breadcrumbService.set('@orderDetails', ' ');
  }

  order: Order | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrder(+id).subscribe(order => {
        this.order = order;
        this.breadcrumbService.set('@orderDetails', 'Order #' + id + ' ' + order.status);
      });
    }
  }
}

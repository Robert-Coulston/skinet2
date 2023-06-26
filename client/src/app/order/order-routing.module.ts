import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailedComponent } from './order-detailed/order-detailed.component';

const routes: Route[] = [
  { path: '', component: OrdersComponent },
  { path: ':id', component: OrderDetailedComponent, data: {breadcrumb:{alias:'orderDetails'}} },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class OrderRoutingModule { }

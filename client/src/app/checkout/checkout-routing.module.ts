import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { CanCheckoutGuard } from './guards/can-checkout.guard';

const routes: Routes = [
  { path: '', canActivate: [CanCheckoutGuard], component: CheckoutComponent },
  { path: 'success', component: CheckoutSuccessComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class CheckoutRoutingModule {}

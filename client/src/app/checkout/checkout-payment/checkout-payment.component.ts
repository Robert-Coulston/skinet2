import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { CheckoutService } from '../checkout.service';
import { ToastrService } from 'ngx-toastr';
import { Basket } from 'src/app/shared/models/basket';
import { Address } from 'src/app/shared/models/user';
import { Order, OrderToCreate } from 'src/app/shared/models/order';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import {
  PaymentIntentResult,
  Stripe,
  StripeCardCvcElement,
  StripeCardExpiryElement,
  StripeCardNumberElement,
  loadStripe,
} from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup | null = null;

  @ViewChild('cardNumber') cardNumberElement: ElementRef | null = null;
  @ViewChild('cardExpiry') cardExpiryElement: ElementRef | null = null;
  @ViewChild('cardCvc') cardCvcElement: ElementRef | null = null;
  stripe: Stripe | null = null;

  cardNumber: StripeCardNumberElement | null = null;
  cardExpiry: StripeCardExpiryElement | null = null;
  cardCvc: StripeCardCvcElement | null = null;
  cardNumberComplete = false;
  cardExpiryComplete = false;
  cardCvcComplete = false;

  cardErrors: string | null = null;

  submittingOrder: boolean = false;

  constructor(
    private basketService: BasketService,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    loadStripe(
      'pk_test_51NMg3RJkOaZp8vZSttpCSFkpEmv8CXWAmszs0JYOYguohTnZtsWU1A6mgwSvqrk9M7SHodtt9x7V4ivc49eJIXXN00KiAA4VQL'
    ).then((stripe) => {
      this.stripe = stripe;
      if (stripe) {
        const elements = stripe.elements();
        if (elements) {
          this.cardNumber = elements.create('cardNumber');
          this.cardNumber.mount(this.cardNumberElement?.nativeElement);
          this.cardNumber.on('change', (event) => {
            this.cardNumberComplete = event.complete;
            if (event.error) {
              this.cardErrors = event.error.message;
            } else {
              this.cardErrors = null;
            }
          });

          this.cardExpiry = elements.create('cardExpiry');
          this.cardExpiry.mount(this.cardExpiryElement?.nativeElement);
          this.cardExpiry.on('change', (event) => {
            this.cardExpiryComplete = event.complete;
            if (event.error) {
              this.cardErrors = event.error.message;
            } else {
              this.cardErrors = null;
            }
          });

          this.cardCvc = elements.create('cardCvc');
          this.cardCvc.mount(this.cardCvcElement?.nativeElement);
          this.cardCvc.on('change', (event) => {
            this.cardCvcComplete = event.complete;
            if (event.error) {
              this.cardErrors = event.error.message;
            } else {
              this.cardErrors = null;
            }
          });
        }
      }
    });
  }

  paymentFormComplete(): boolean {
      return this.checkoutForm!.get('paymentForm')!.valid &&
      this.cardNumberComplete &&
      this.cardExpiryComplete &&
      this.cardCvcComplete
  }

  async submitOrder() {
    this.submittingOrder = true;

    const basket = this.basketService.getCurrentBasketValue();
    try {
      if (!basket) {
        throw new Error('Unable to get basket');
      }
      const createdOrder = await this.createOrder(basket);
      const paymentIntentResult = await this.confirmPaymentWithStripe(basket);

      if (paymentIntentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['checkout/success'], navigationExtras);
        this.toastr.success('Order created');
      } else {
        this.toastr.error(paymentIntentResult.error.message); // error from stripe
      }
    } catch (error: any) {
      console.log(error);
      this.toastr.error(error.message);
    } finally {
      this.submittingOrder = false;
    }
  }

  private async confirmPaymentWithStripe(
    basket: Basket
  ): Promise<PaymentIntentResult> {
    const nameOnCard = this.checkoutForm
      ?.get('paymentForm')
      ?.get('nameOnCard')?.value;

    var result = this.stripe?.confirmCardPayment(basket.clientSecret!, {
      payment_method: {
        card: this.cardNumber! as StripeCardNumberElement,
        billing_details: { name: nameOnCard },
      },
    });

    if (!result) {
      throw new Error('Problem with stripe'); // stripe returned undefined (no PaymentIntentResult)
    }

    return result;
  }

  private async createOrder(basket: Basket): Promise<Order> {
    const orderToCreate = this.getOrderToCreate(basket);
    if (!orderToCreate) {
      throw new Error('Insufficient order parameters');
    }

    return firstValueFrom(this.checkoutService.createOrder(orderToCreate));
  }

  getOrderToCreate(basket: Basket): OrderToCreate | null {
    const deliveryMethodId = this.checkoutForm
      ?.get('deliveryForm')
      ?.get('deliveryMethod')?.value;

    const shipToAddress = this.checkoutForm?.get('addressForm')
      ?.value as Address;

    if (!deliveryMethodId || !shipToAddress) {
      return null;
    }

    return {
      basketId: basket.id,
      deliveryMethodId,
      shipToAddress,
    } as OrderToCreate;
  }
}

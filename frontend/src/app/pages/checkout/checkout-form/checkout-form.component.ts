import { Component } from '@angular/core';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
})
export class CheckoutFormComponent {
  constructor(private checkoutService: CheckoutService) {}

  get checkoutForm () {
    return this.checkoutService.orderFormGroup.get('order.billingDetails');
  }
}

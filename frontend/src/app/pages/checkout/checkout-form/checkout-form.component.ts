import { Component } from '@angular/core';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss'],
})
export class CheckoutFormComponent {
  createBoolean = false;

  constructor(private checkoutService: CheckoutService) {}

  get checkoutForm(): any {
    return this.checkoutService.orderFormGroup.get('order.billingDetails');
  }

  createAccount(): void {
    this.createBoolean = !this.createBoolean;
    this.checkoutService.setCreateAccount(this.createBoolean);
  }
}

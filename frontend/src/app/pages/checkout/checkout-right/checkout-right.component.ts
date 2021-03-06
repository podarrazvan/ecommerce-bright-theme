import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DiscountService } from 'src/app/shared/services/database/discount.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { OrdersService } from '../../admin/orders/orders.service';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-right',
  templateUrl: './checkout-right.component.html',
  styleUrls: ['./checkout-right.component.scss'],
})
export class CheckoutRightComponent {
  total = 0;
  subtotal = 0;
  products;
  shippingPrice;
  cutTotal = 0;
  termsAccepted = false;

  constructor(
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private ordersService: OrdersService,
    private router: Router,
    private discountService: DiscountService,
    public sharedDataService: SharedDataService
  ) {
    this.products = JSON.parse(localStorage.getItem('cart'));
    for (const product of this.products) {
      this.total += product.price;
    }
    this.subtotal = this.total;
    const coupon = JSON.parse(localStorage.getItem('coupon'));
    if (coupon != null) {
      this.checkCoupon(coupon.code);
    }
  }

  get checkoutForm(): any {
    return this.checkoutService.orderFormGroup.get('order');
  }
  get orderDetailsForm(): any {
    this.shippingPrice = this.checkoutService.orderFormGroup.get(
      'order.orderDetails'
    ).value.shipping;
    return this.checkoutService.orderFormGroup.get('order.orderDetails');
  }

  get productsFrom(): any {
    return this.checkoutService.orderFormGroup.get(
      'order.products'
    ) as FormArray;
  }

  placeOrder(): void {
    if (this.termsAccepted) {
      if (!this.checkoutForm.valid) {
        this.checkoutService.createAccount$.subscribe((createAccount) => {
          if (createAccount) {
            const email = this.checkoutForm.value.billingDetails.email;
            localStorage.setItem('emailNewAccount', JSON.stringify(email));
            const url = `${window.location.origin}/auth`;
            window.open(url, '_blank');
          }
        });
        for (const prod of this.products) {
          const product = prod.id;
          const quantity = prod.quantity;
          const price = prod.price;
          this.productsFrom.push(this.createProduct(product, quantity, price));
        }
        this.orderDetailsForm.patchValue({ total: this.total });
        const date = new Date();
        this.orderDetailsForm.patchValue({ date });
        const payment = this.orderDetailsForm.value.payment;
        if (payment === 'online') {
          this.router.navigate(['/order-payment']);
          localStorage.setItem(
            'order',
            JSON.stringify(this.checkoutForm.value)
          );
        } else {
          this.ordersService
            .addOrder(this.checkoutForm.value)
            .subscribe((response) => {
              const orderNumber = response.body.order.orderNumber;
              localStorage.removeItem('cart');
              localStorage.removeItem('coupon');
              this.router.navigate(['../order-status', orderNumber]);
            });
        }
      } else {
        alert('Please check all fields');
      }
    } else {
      alert(
        'You cannot place an order if you do not agree with the terms of use'
      );
    }
  }

  public createProduct(product, quantity, price): FormGroup {
    return this.fb.group({ product, quantity, price });
  }

  checkCoupon(code): void {
    this.discountService.getCoupon(code).subscribe((coupon) => {
      this.cutTotal = coupon.discount;
      if (this.cutTotal > this.total) {
        this.cutTotal = this.total;
      }
      this.total -= this.cutTotal;
    });
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DiscountService } from 'src/app/shared/services/database/discount.service';
import { Coupon } from '../../../../shared/interfaces/coupon.interface';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-coupons-edit',
  templateUrl: './coupons-edit.component.html',
  styleUrls: ['./coupons-edit.component.scss'],
})
export class CouponsEditComponent {
  @Output() newCoupons = new EventEmitter<Coupon[]>();

  couponFormGroup: FormGroup;
  couponsArray: Coupon[];

  couponsHide = true;

  editCouponMode: number;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private discountService: DiscountService
  ) {
    this.buildFormGroup(fb);
    this.discountService.getCoupons().subscribe((coupons) => {
      for (let coupon of coupons) {
        this.couponsForm.push(this.createCoupon(coupon));
      }
    });
  }

  get code() {
    return this.couponFormGroup.get('code');
  }

  get discount() {
    return this.couponFormGroup.get('discount');
  }

  get couponsForm() {
    return this.adminService.adminFormGroup.get('configs.coupons') as FormArray;
  }

  addNewValue() {
    const coupon = {
      code: this.code.value,
      discount: this.discount.value,
    };
    this.couponsForm.push(this.createCoupon(coupon));
    this.discountService.createCoupon(coupon).subscribe((response) => {
      this.couponFormGroup.reset();
      this.newCoupons.emit(this.couponsForm.value);
    });
  }

  delete(index) {
    const id = this.couponsForm.value[index]._id;
    console.log(id);
    this.discountService.deleteCoupon(id).subscribe(() => {
      this.couponsForm.value.splice(index, 1);
      this.newCoupons.emit(this.couponsForm.value);
    });
  }

  edit(index) {
    this.editCouponMode = null;
    const coupon = {
      _id: this.couponsForm.value[index]._id,
      code: this.code.value,
      discount: this.discount.value,
    };
    this.couponsForm.value[index] = coupon;
    this.discountService.editCoupon(coupon).subscribe(() => {
      this.newCoupons.emit(this.couponsForm.value);
    });
  }

  public createCoupon(coupon): FormGroup {
    const { _id, code, discount } = coupon;
    return this.fb.group({
      _id,
      code,
      discount,
    });
  }

  private buildFormGroup(fb) {
    this.couponFormGroup = fb.group({
      _id: fb.control(null),
      code: fb.control(null),
      discount: fb.control(null),
    });
  }
}

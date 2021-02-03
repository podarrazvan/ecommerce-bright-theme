import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Coupon } from '../../../../shared/interfaces/coupon.interface';
import { DbWebsiteEditService } from '../../../../shared/services/database/db-website-edit.sevice';

@Component({
  selector: 'app-coupons-edit',
  templateUrl: './coupons-edit.component.html',
  styleUrls: ['./coupons-edit.component.scss']
})
export class CouponsEditComponent implements OnInit {

  @Input() coupons: Coupon[] = [];
  @Output() newCoupons = new EventEmitter<Coupon[]>();

  constructor(private dbWebsiteEditService: DbWebsiteEditService) { }

  couponsArray: Coupon[];

  couponsHide = true;

  editCouponMode: number;

  ngOnInit(): void {
    this.couponsArray = this.coupons;
  }

  addNewValue(coupon) {
    this.coupons.push(coupon.value);
    this.newCoupons.emit(this.coupons);
    this.dbWebsiteEditService.addCoupon(coupon.value);
  }

  delete(index) {

  }

  edit(index) {

  }

}
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DiscountService } from 'src/app/shared/services/database/discount.service';
import { User } from '../../shared/interfaces/user.interface';
import { SharedDataService } from '../../shared/services/shared-data.service';
import { ProductsService } from '../admin/products/products.service';
import { UsersService } from '../admin/users/user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
  product;
  loading = true;
  user: User;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private sharedDataService: SharedDataService,
    private usersService: UsersService,
    private discountService: DiscountService
  ) {
    const key = this.route.snapshot.params['key'];
    this.productsService.getProduct(key).subscribe((response) => {
      this.checkPromotion(response);
      this.sharedDataService.userDetails.subscribe((response) => {
        this.user = response;
        const product = { product: key };
        const exists = this.productExists(key);
        if (!exists) {
          this.user.history.push(product);
          this.sharedDataService.updateUserDetails(this.user);
          this.productsService.updateProduct(this.product);
          if (this.user.email != undefined) {
            this.usersService
              .updateHistory(this.user.email, this.user.history)
              .subscribe();
          }
        }
      });
    });
  }

  checkPromotion(product) {
    let price;
    //TODO check auth
    let authenticated = false;
    //
    if (authenticated) {
      this.discountService
        .checkAuthForPromotion(product._id)
        .subscribe((response) => {
          if (response.length > 0) {
            for (let discount of response) {
              price = product.price - discount.cut;
              this.product = product;
              this.product.price = price;
              this.loading = false;
            }
          } else {
            this.product = product;
            this.loading = false;
          }
        });
    } else {
      this.discountService
        .checkForPromotion(product._id)
        .subscribe((response) => {
          if (response != null) {
            price = product.price - response.cut;
          } else {
            price = product.price;
          }
          this.product = product;
          this.product.price = price;
          this.loading = false;
        });
    }
  }

  setProduct() {}

  productExists(key) {
    for (let product of this.user.history) {
      if (product.product == key) {
        return true;
      }
    }
    return false;
  }
}

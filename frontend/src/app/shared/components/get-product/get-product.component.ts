import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-get-product',
  templateUrl: './get-product.component.html',
  styleUrls: ['./get-product.component.scss']
})
export class GetProductComponent {

  @Input() product: Product;
  @Input() fullContent: boolean;

  showHiddenBtn = false;

  constructor(private router: Router) { }

  openProduct() {
    this.router.navigate(['/product', this.product._id]);
  }

}
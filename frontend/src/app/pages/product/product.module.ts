import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/modules/shared.module';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductImgCarouselComponent } from './product-img/product-img-carousel/product-img-carousel.component';
import { ProductImgComponent } from './product-img/product-img.component';
import { ProductComponent } from './product.component';
import { WebsiteFeaturesComponent } from './website-features/website-features.component';

@NgModule({
  declarations: [
    ProductComponent,
    ProductDetailsComponent,
    ProductImgComponent,
    ProductImgCarouselComponent,
    WebsiteFeaturesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: ':key', component: ProductComponent }]),
  ],
  exports: [RouterModule],
})
export class ProductModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigsModule } from './modules/config/configs.module';
import { ContactModule } from './modules/contact/contact.module';
import { CouponSchema } from './modules/coupon/coupon.model';
import { CouponController } from './modules/coupon/coupon.controllers';
import { CouponService } from './modules/coupon/coupon.service';
import { ProductController } from './modules/product/product.controllers';
import { ProductSchema } from './modules/product/product.model';
import { ProductService } from './modules/product/product.service';
import { DiscountSchema } from './modules/discount/discount.model';
import { DiscountController } from './modules/discount/discount.controllers';
import { DiscountService } from './modules/discount/discount.service';
import { OrderSchema } from './modules/order/order.model';
import { OrderService } from './modules/order/order.service';
import { OrderController } from './modules/order/order.controllers';
import { StatisticsService } from './modules/statistics/statistics.service';
import { StatisticsController } from './modules/statistics/statistics.controllers';
import { StatisticsSchema } from './modules/statistics/statistics.model';
import { UsersModule } from './modules/user/user.module';
import { UploadImageModule } from './shared/modules/images/upload-images.module';

//! ok but not working!
// @Module({
//   imports: [
//     ConfigsModule,
//     ContactModule,
//     CouponModule,
//     DiscountModule,
//     OrderModule,
//     ProductModule,
//     StatisticsModule,
//     MongooseModule.forRoot(
//       'mongodb+srv://admin:admin@backend-test.6tqwn.mongodb.net/ecommerce',
//     ),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
//!

//! not ok, but working
@Module({
  imports: [
    ConfigsModule,
    ContactModule,
    UsersModule,
    UploadImageModule,
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@backend-test.6tqwn.mongodb.net/ecommerce',
    ),
    MongooseModule.forFeature([
      { name: 'Coupon', schema: CouponSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Discount', schema: DiscountSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Statistics', schema: StatisticsSchema },
    ]),
  ],
  controllers: [
    AppController,
    CouponController,
    ProductController,
    DiscountController,
    OrderController,
    ProductController,
    StatisticsController,
  ],
  providers: [
    AppService,
    CouponService,
    ProductService,
    DiscountService,
    OrderService,
    ProductService,
    StatisticsService,
  ],
})
//!
export class AppModule {}

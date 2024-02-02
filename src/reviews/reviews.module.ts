import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reviews } from './reviews.entity';
import { Order } from 'src/order/order.entity';
import { Payment_Detail } from 'src/payment_detail/payment_detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reviews, Order, Payment_Detail])],
  providers: [ReviewsService],
  controllers: [ReviewsController]
})
export class ReviewsModule { }

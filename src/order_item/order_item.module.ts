import { Module } from '@nestjs/common';
import { OrderItemController } from './order_item.controller';
import { OrderItemService } from './order_item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order_Item } from './order_item.entity';
import { Product } from 'src/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order_Item, Product])],
  controllers: [OrderItemController],
  providers: [OrderItemService]
})
export class OrderItemModule { }

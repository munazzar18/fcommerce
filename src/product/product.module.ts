import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Product_Inventory } from 'src/product_inventory/product_inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Product_Inventory])
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}

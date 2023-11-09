import { Module } from '@nestjs/common';
import { ProductInventoryController } from './product_inventory.controller';
import { ProductInventoryService } from './product_inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product_Inventory } from './product_inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product_Inventory])],
  controllers: [ProductInventoryController],
  providers: [ProductInventoryService]
})
export class ProductInventoryModule {}

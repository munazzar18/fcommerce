import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order_Item } from './order_item.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/product/product.entity';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class OrderItemService {
    constructor(
        @InjectRepository(Order_Item) private orderItemRepo: Repository<Order_Item>,
        @InjectRepository(Product) private prodRepo: Repository<Product>
    ) { }


    async getAll() {
        return this.orderItemRepo.find()
    }

    async getById(id: number) {
        return this.orderItemRepo.findOneBy({ id })
    }

    async create(productId: number, quantity: number,) {
        const selectedProduct = await this.prodRepo.findOne({
            where: {
                id: productId,
            }
        });

        if (!selectedProduct) {
            throw new NotFoundException('No product found for this id');
        }

        if (selectedProduct.quantity <= 0 || selectedProduct.quantity < quantity) {
            throw new BadRequestException('Product is out of stock or quantity exceeded!');
        }

        const orderItem = new Order_Item();
        orderItem.product = selectedProduct;
        orderItem.quantity = quantity;

        selectedProduct.quantity -= quantity;

        await this.prodRepo.save(selectedProduct);
        await this.orderItemRepo.save(orderItem);

        return orderItem;
    }
}




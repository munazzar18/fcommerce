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

    async create(productId: number, authUser: UserEntity) {
        const selectedProduct = await this.prodRepo.findOne({
            where: {
                id: productId,
                userId: authUser.id
            }
        })
        if (selectedProduct) {
            if (selectedProduct.quantity > 0) {
                const item = selectedProduct.quantity

            } else {
                throw new BadRequestException('Product is out of stock!')
            }
        } else {
            throw new NotFoundException('No product found for this id')
        }
    }

}

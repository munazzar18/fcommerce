import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';
import e from 'express';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(Product) private productRepo: Repository<Product>
    ) { }

    async findAllCart() {
        return this.cartRepo.find()
    }

    async findCartById(id: number) {
        return this.cartRepo.findOneBy({ id })
    }

    async findUserCart(userId: number) {
        return this.cartRepo.findOne({
            where: {
                user: {
                    id: userId
                }
            },
            relations: ['products'],
        })
    }

    async create(productId: number, authUser: UserEntity) {
        const selectedProduct = await this.productRepo.findOne({
            where: { id: productId }
        });

        if (!selectedProduct) {
            throw new NotFoundException('No product to add in cart!');
        }

        const productInCart = await this.cartRepo.find()
        const grandTotal = productInCart.map((el) => el.quantity)
        const calculatedTotal = grandTotal.reduce((el, cl) => el + cl)

        const existingProduct = await this.cartRepo.findOne({
            where: {
                product: {
                    id: productId
                }
            }
        })
        if (existingProduct) {
            existingProduct.user = authUser;
            existingProduct.product = selectedProduct
            existingProduct.quantity += 1;
            existingProduct.total += 1;
            await this.cartRepo.save(existingProduct)
            return existingProduct
        }
        else {
            const cart = new Cart()
            cart.user = authUser
            cart.product = selectedProduct
            cart.quantity = 1;
            cart.total = calculatedTotal ? calculatedTotal + 1 : 1;
            await this.cartRepo.save(cart)
            return cart
        }
    }
}



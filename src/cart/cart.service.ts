import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';

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


    async create(productId: number, authUser: UserEntity) {
        const selectedProduct = await this.productRepo.findOne({
            where: {
                id: productId,
                userId: authUser.id
            }
        })
        if (!selectedProduct) {
            throw new NotFoundException('No product to add in cart!')
        }
        else {
            const productInCart = await this.cartRepo.findOne({
                where: {
                    product: {
                        id: selectedProduct.id
                    },
                    user: {
                        id: authUser.id
                    }
                }
            })
            if (productInCart) {
                if (selectedProduct.quantity > 0) {
                    productInCart.quantity += 1;
                    return await this.cartRepo.save(productInCart);
                } else {
                    throw new NotFoundException("This product is out of stock!");
                }
            } else {
                if (selectedProduct.quantity > 0) {
                    const cartEntry = this.cartRepo.create({
                        product: selectedProduct,
                        quantity: 1,
                        user: authUser
                    });
                    await this.cartRepo.save(cartEntry);
                    return cartEntry;
                } else {
                    throw new NotFoundException("This product is out of stock!");
                }
            }

        }


    }

}

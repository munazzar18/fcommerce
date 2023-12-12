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


        // Check if the user has an existing cart
        let cart = await this.cartRepo.findOne({
            where: {
                user: {
                    id: authUser.id
                },
            },
            relations: ['products']
        });


        if (!cart) {
            // If the user doesn't have a cart, create a new one
            cart = new Cart();
            cart.products = [selectedProduct];
            cart.quantity = 1;
            cart.total = 1;
            cart.user = authUser;
        } else {
            // If the user has a cart
            const existingProduct = cart.products.find((product) => product.id === selectedProduct.id);

            if (existingProduct) {
                // If the product is already in the cart, update quantity and total
                existingProduct.quantity += 1;
                cart.total += 1;
            } else {
                // If the product is not in the cart, add it with quantity 1 and update total
                cart.products.push(selectedProduct);
                cart.quantity += 1;
                cart.total += 1;
            }
        }

        await this.cartRepo.save(cart); // Save/update the cart
        return cart;
    }

}



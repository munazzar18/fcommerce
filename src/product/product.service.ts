import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { In, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './productDto.dto';
import { UserEntity } from 'src/user/user.entity';
import { Product_Inventory } from 'src/product_inventory/product_inventory.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepo: Repository<Product>,
        @InjectRepository(Product_Inventory) private product_inventory_repo: Repository<Product_Inventory>
    ){}

    async allProducts(page: number){
        const val = 10;
        const products = await this.productRepo.find({
            order: {
                id: 'ASC'
            },
            skip: (page - 1) * val,
            take: (page * val)
        })
        return products
    }

    async filterByCategory(categoryIds: number[]){
        const products = await this.productRepo.find({
            where: {
                categoryId: In(categoryIds)
            }
        })
        if(products.length === 0){
            throw new NotFoundException('No product found for this category')
        }
        else {
            return products
        }
    }

    async searchFilter(search: any){
        const products = await this.productRepo.createQueryBuilder().select()
        .where(`LIKE(title) AGAINST ('*${search}*' IN NATURAL LANGUAGE MODE)`)
        .orWhere(`LIKE(description) AGAINST( '*${search}*' IN NATURAL LANGUAGE MODE )`)
        .getMany()

    if(products.length === 0){
        throw new NotFoundException(`No product found against ${search}`)
    } else {
        return products
    }
    }

    async productById(id: number){
        const product = await this.productRepo.findOneBy({id})
        return product
    }
    async create(createDto: CreateProductDto, authUser: UserEntity){
        const product =  this.productRepo.create({
            ...createDto,
            userId: authUser.id,
        })
        const savedProduct = await this.productRepo.save(product)

        const productInventory = this.product_inventory_repo.create({
            quantity: createDto.quantity,
            productId: savedProduct.id
        })

        savedProduct.product_inventory = productInventory
        savedProduct.product_inventory_id = productInventory.id

        await this.productRepo.save(savedProduct)

        return savedProduct
    }

    async update(id: number, updateDto: UpdateProductDto, authUser: UserEntity){
        const product = await this.productRepo.findOne({
            where: {
                id: id,
                userId: authUser.id
            }, 
            relations: ['product_inventory'],
        })
        if(!product){
            throw new UnauthorizedException('You are not authorized to perform this action')
        }
        else {
            product.title = updateDto.title;
            product.description = updateDto.description;
            product.price = updateDto.price;
            product.images = updateDto.images;
        }
        if(updateDto.quantity !== undefined){
            if(product.product_inventory){
                product.product_inventory.quantity = updateDto.quantity
            } else {
                const productInventory = this.product_inventory_repo.create({
                    quantity: updateDto.quantity
                })
                product.product_inventory = productInventory
            }
        }
        await this.productRepo.save(product)
        return product
    }

}

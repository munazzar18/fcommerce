import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { In, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './productDto.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepo: Repository<Product>
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
        .where(`MATCH(title) AGAINST( '*${search}*' IN NATURAL LANGUAGE MODE )`)
        .orWhere(`MATCH(description) AGAINST( '*${search}*' IN NATURAL LANGUAGE MODE )`)
        .getMany()
    if(products.length === 0){
        throw new NotFoundException('No product found')
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

        return savedProduct
    }

    async update(id: number, updateDto: UpdateProductDto, authUser: UserEntity){
        const product = await this.productRepo.findOne({
            where: {
                id: id,
                userId: authUser.id
            }, 
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
    }

}

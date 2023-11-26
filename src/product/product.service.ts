import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ILike, In, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './productDto.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepo: Repository<Product>
    ) { }

    async allProducts(page: number) {
        const val = 10;
        const products = await this.productRepo.find({
            order: {
                id: 'ASC'
            },
            skip: (page - 1) * val,
            take: (page * val),
            relations: { category: true }
        })
        return products
    }

    async filterByCategory(categoryIds: number[]) {
        const products = await this.productRepo.find({
            where: {
                categoryId: In(categoryIds)
            }
        })
        return products
      
    }

    async searchFilter(search: any) {
        const products = await this.productRepo.createQueryBuilder().select()
            .where(`MATCH(title) AGAINST( '${search}' IN NATURAL LANGUAGE MODE )`)
            .orWhere(`(description) LIKE '%${search}%' `)
            .getMany()
            return products
        
        // const products = await this.productRepo.find({
        //     where: [
        //         {title: ILike(`%${search}%`)},
        //         {description: ILike(`%${search}%`)}
        //     ]
        // })
        // return products
    }

    async productById(id: number) {
        const product = await this.productRepo.findOne({
            where: {
                id,
            },
            relations: { category: true }
        })
        return product
    }
    async create(createDto: CreateProductDto, authUser: UserEntity) {
        const product = this.productRepo.create({
            ...createDto,
            userId: authUser.id,
        })
        const savedProduct = await this.productRepo.save(product)

        return savedProduct
    }

    async update(id: number, updateDto: UpdateProductDto, authUser: UserEntity) {
        const product = await this.productRepo.findOne({
            where: {
                id: id,
                userId: authUser.id
            },
            relations: { category: true }
        })
        if (!product) {
            throw new UnauthorizedException('You are not authorized to perform this action')
        }
        else {
            product.title = updateDto.title;
            product.description = updateDto.description;
            product.price = updateDto.price;
            product.images = updateDto.images;
        }
        const updatedProduct = await this.productRepo.save(product)
        return updatedProduct

    }

    async deleteProduct(id: number, authUser: UserEntity) {
        const product = await this.productRepo.findOne({
            where: {
                id: id,
                userId: authUser.id
            },
        })
        if (!product) {
            throw new UnauthorizedException()
        }
        await this.productRepo.delete(id)
    }

}

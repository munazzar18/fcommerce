import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ILike, In, Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './productDto.dto';
import { UserEntity } from 'src/user/user.entity';
import { sendJson } from 'src/helpers/helpers';

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
        if (!products) {
            return null;
        }

        const allProducts = products.map((el) => {
            const images = el.images.map((img) => "http://localhost:5005" + img)
            el.images = images
            return el;
        })
        return allProducts
    }

    async filterByCategory(categoryIds: number[]) {
        const products = await this.productRepo.find({
            where: {
                categoryId: In(categoryIds)
            }
        })
        if (!products) {
            return null
        }
        return products

    }

    async searchFilter(search: any) {
        const products = await this.productRepo.createQueryBuilder().select()
            .where(`MATCH(title) AGAINST( '${search}' IN NATURAL LANGUAGE MODE )`)
            .orWhere(`(description) LIKE '%${search}%' `)
            .getMany()

        if (!products) {
            return null
        }
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

    async productForAuthUser(authUserId: number) {
        const product = await this.productRepo.find({
            where: {
                userId: authUserId
            },
            relations: { category: true }
        })
        if (!product) {
            return null
        }
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
            product.quantity = updateDto.quantity;
            product.category.id = updateDto.categoryId;
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

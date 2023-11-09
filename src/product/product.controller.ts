import { Body, Controller, Get, NotFoundException, Param, ParseArrayPipe, ParseIntPipe, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { sendJson } from 'src/helpers/helpers';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateProductDto } from './productDto.dto';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { UserEntity } from 'src/user/user.entity';

@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService
    ){}

    @Get()
    async getAllProducts(@Query('page', ParseIntPipe) page: number){
        const products = await this.productService.allProducts(page)
        return sendJson(true, "Products fetched successfully", products)
    }

    @Get('category')
    async filterByCategory(@Query('categoryIds', new ParseArrayPipe({ items: Number, separator: ',' })) categoryIds: number[]){
        const products = await this.productService.filterByCategory(categoryIds)
        if(products){
            return sendJson(true, "Filtered Products found successfully" , products)
        } 
        else {
            throw new NotFoundException("No products found for this category")
        }
    } 
    
    @Get('search')
    async searchFilter(@Query('search') search: string){
        try {
            const products = await this.productService.searchFilter(search)
            return sendJson(true, 'Product found successfully', products)
        } catch (error) {
            throw new NotFoundException(`No products found for this ${search}`)
        }
    }
    @Get('/:id')
    async getById(@Param('id', ParseIntPipe)id: number){
        const product = await this.productService.productById(id)
        if(product){
            return sendJson(true, 'Product found successfully', product)
        } else {
            throw new NotFoundException('No product found')
        }
    }

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Seller)
    async create(@Body()createDto: CreateProductDto, @Request() req){
        const userId: UserEntity = req.user
        const product = await this.productService.create(createDto, userId)
        return sendJson(true, 'Product created Successfully', product)
    }


}

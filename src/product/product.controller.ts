import { Body, Controller, Get, NotFoundException, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query, Request, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { sendJson } from 'src/helpers/helpers';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateProductDto, UpdateProductDto, UploadFileDto } from './productDto.dto';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { UserEntity } from 'src/user/user.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

    @Put('/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Seller)
    async update(@Param('id', ParseIntPipe) id: number , @Body()updateDto: UpdateProductDto, @Request()req ){
        const userId: UserEntity = req.user
        const product = await this.productService.update(id, updateDto, userId)
        return sendJson(true, 'Product updated successfully', product)
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uploads/images',
            filename: (req, file, callback) => {
                const orginalName = file.originalname;
                const extention = extname(orginalName)
                const fileName = Date.now() + extention;
                callback(null, fileName)
            }
        })
    }))
    uploadImage(@Body() body: UploadFileDto, @UploadedFiles() files: Express.Multer.File[]) {
        const fileUrls = files.map((file) => 'uploads/images' + file.filename)
        return sendJson(true, 'Images uploaded successfully', fileUrls)
    }

}

import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService
    ){}

    @Get()
    async getAllProducts(@Query('page', ParseIntPipe) page: number){
        
    }
}

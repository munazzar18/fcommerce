import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { sendJson } from 'src/helpers/helpers';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { CreateCartDto } from './cartDto.dto';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService
    ) { }

    @Get()
    async getCarts() {
        const carts = await this.cartService.findAllCart()
        return sendJson(true, "cart fetched successfully", carts)
    }

    @Get('/:id')
    async getCartById(@Param('id', ParseIntPipe) id: number) {
        const cart = await this.cartService.findCartById(id)
        return sendJson(true, "cart found successfully", cart)
    }

    @Post()
    @UseGuards(AuthGuard)
    async createcart(@Body() createCart: CreateCartDto, @Request() req) {
        const userId: UserEntity = req.user
        const cart = await this.cartService.create(createCart.productId, userId)
        return sendJson(true, "Product added to cart successfully", cart)
    }
}
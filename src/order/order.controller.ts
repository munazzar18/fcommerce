import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { sendJson } from 'src/helpers/helpers';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { createOrderDto } from './order.dto';

@Controller('order')
export class OrderController {
    constructor(
        private orderService: OrderService
    ) { }

    @Get()
    async findOrders() {
        const orders = await this.orderService.all()
        return sendJson(true, "Orders fetched", orders)
    }

    @Get('/:id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        const order = await this.orderService.byId(id)
        return sendJson(true, "Order fetched Successfully", order)
    }

    // @Post()
    // @UseGuards(AuthGuard)
    // async createOrder(@Body() @Body() { productIds, quantity }: { productIds: number[], quantity: number }, @Request() req) {
    //     const user: UserEntity = req.user
    //     console.log("Product id:", productIds)
    //     const order = await this.orderService.create(productIds, user, quantity)
    //     return sendJson(true, "Order created Successfully", order)
    // }

}

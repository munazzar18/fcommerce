import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards } from '@nestjs/common';
import { OrderItemService } from './order_item.service';
import { sendJson } from 'src/helpers/helpers';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderItemDto } from './order_item.dto';
import { UserEntity } from 'src/user/user.entity';

@Controller('order-item')
export class OrderItemController {
    constructor(
        private orderItemService: OrderItemService
    ) { }

    @Get()
    async getOrderItem() {
        const orderItems = await this.orderItemService.getAll()
        return sendJson(true, "Order Items", orderItems)
    }

    @Get('/:id')
    async getOrderItemById(
        @Param('id', ParseIntPipe) id: number
    ) {
        const orderItem = await this.orderItemService.getById(id)
        if (orderItem) {

            return sendJson(true, "Order Item", orderItem)
        } else {
            return sendJson(false, "No Items found for this id!")
        }
    }

    @Get('userId/:userId')
    async getByUserId(@Param('userId', ParseIntPipe) userId: number) {
        const orderItem = await this.orderItemService.getByUserId(userId)
        if (orderItem) {
            return sendJson(true, "Order Item found successfully", orderItem)
        } else {
            return sendJson(false, "No items found")
        }
    }

    @UseGuards(AuthGuard)
    @Post()
    async createOrderItem(@Body() orderItemDto: OrderItemDto, @Request() req) {
        const user: UserEntity = req.user
        const orderItem = await this.orderItemService.create(orderItemDto.productId, orderItemDto.quantity, user)
        return sendJson(true, "Order Item created successfully", orderItem)
    }
}

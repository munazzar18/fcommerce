import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { In, Repository } from 'typeorm';
import { Order_Item } from 'src/order_item/order_item.entity';
import { Product } from 'src/product/product.entity';
import { Payment_Detail } from 'src/payment_detail/payment_detail.entity';
import { UserEntity } from 'src/user/user.entity';
import { Status } from 'src/payment_detail/payment_status.enum';
import { sendJson } from 'src/helpers/helpers';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(Order_Item) private order_item_repo: Repository<Order_Item>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
        @InjectRepository(Payment_Detail) private paymentRepo: Repository<Payment_Detail>

    ) { }

    async all() {
        return this.orderRepo.find()
    }

    async byId(id: number) {
        return this.orderRepo.findOneBy({ id })
    }

    async create(orderItemId: number, quantity: number, authUser: UserEntity,) {

        const orderItem = await this.order_item_repo.findOne({
            where: {
                id: orderItemId
            },
            relations: ['product']
        })
        if (!orderItem) {
            throw new NotFoundException(sendJson(false, "No item find to place order"))
        }
        const totalPrice = orderItem.product.price * quantity

        const paymentDetail = new Payment_Detail()
        paymentDetail.amount = totalPrice
        paymentDetail.status = Status.Pending
        paymentDetail.provider = "JazzCash"
        paymentDetail.payment = 0

        const savedPaymentDetail = await this.paymentRepo.save(paymentDetail)

        const order = new Order()
        order.orderItems = [orderItem]
        order.payment_detail = savedPaymentDetail
        order.total = totalPrice
        order.user = authUser
        const savedOrder = await this.orderRepo.save(order)
        return savedOrder
    }
}

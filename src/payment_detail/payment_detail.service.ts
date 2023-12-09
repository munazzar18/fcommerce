import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment_Detail } from './payment_detail.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Order } from 'src/order/order.entity';
import { sendJson } from 'src/helpers/helpers';
import { Status } from './payment_status.enum';

@Injectable()
export class PaymentDetailService {
    constructor(
        @InjectRepository(Payment_Detail) private paymentDetail: Repository<Payment_Detail>,
        @InjectRepository(Order) private order: Repository<Order>
    ) { }

    async get() {
        const paymentDetail = await this.paymentDetail.find()
        return paymentDetail
    }

    async create(orderId: number, payment: number, authUser: UserEntity) {
        const order = await this.order.findOne({
            where: {
                id: orderId
            },
            relations: { payment_detail: true }
        })
        if (!order) {
            throw new NotFoundException(sendJson(false, "Order not found"))
        }
        console.log("payment:", payment)
        if (order.payment_detail) {
            if (order.total === payment) {
                order.payment_detail.payment = payment
                order.payment_detail.status = Status.Paid
                await this.paymentDetail.save(order.payment_detail)
            } else {
                throw new BadRequestException(sendJson(false, "Amount does not matched"))
            }
        }
        order.total = payment

        return order.payment_detail

    }
}
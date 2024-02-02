import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reviews } from './reviews.entity';
import { In, Repository } from 'typeorm';
import { Order } from 'src/order/order.entity';
import { Payment_Detail } from 'src/payment_detail/payment_detail.entity';
import { Status } from 'src/payment_detail/payment_status.enum';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Reviews) private reviewRepo: Repository<Reviews>,
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(Payment_Detail) private paymentRepo: Repository<Payment_Detail>
    ) { }


    async findAll() {
        return await this.reviewRepo.find()
    }

    async findById(id: number) {
        return await this.reviewRepo.findOneBy({ id })
    }

    async create(orderId: number) {
        const order = await this.orderRepo.findOne({
            where: {
                id: orderId
            }
        })
        if (!order) {
            throw new BadRequestException("Order not found")
        }


        console.log("Order:", order.orderItems)
    }
}

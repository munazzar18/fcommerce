import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { In, Repository } from 'typeorm';
import { Order_Item } from 'src/order_item/order_item.entity';
import { Product } from 'src/product/product.entity';
import { Payment_Detail } from 'src/payment_detail/payment_detail.entity';
import { UserEntity } from 'src/user/user.entity';
import { Status } from 'src/payment_detail/payment_status.enum';

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

    async create(productIds: number[], authUser: UserEntity, quantity: number) {

        // const products = await this.productRepo.find({
        //     where: {
        //         id: In(productIds)
        //     }
        // })
        // console.log("Product:", products)
        // const total = products.reduce((sum, product) => sum + product.price, 0)

        // const paymentDetail = await this.paymentRepo.save({
        //     amount: total,
        //     status: Status.Pending,
        //     providers: "JazzCash",
        // })

        // const order = await this.orderRepo.save({
        //     total,
        //     payment_detail: paymentDetail,
        //     user: authUser
        // })

        // const orderItem = products.map(product => ({
        //     quantity: quantity,
        //     product: product,
        //     order: order
        // }))

        // await this.order_item_repo.save(orderItem)

        // return order
    }
}

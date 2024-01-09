import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment_Detail } from './payment_detail.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Order } from 'src/order/order.entity';
import { sendJson } from 'src/helpers/helpers';
import { Status } from './payment_status.enum';
import Stripe from "stripe"

@Injectable()
export class PaymentDetailService {
    constructor(
        @InjectRepository(Payment_Detail) private paymentDetail: Repository<Payment_Detail>,
        @InjectRepository(Order) private order: Repository<Order>,
    ) { }
    private stripe = new Stripe(process.env.SECRET_KEY);

    async get() {
        const paymentDetail = await this.paymentDetail.find()
        return paymentDetail
    }

    async checkoutSession(orderId: number) {

        const order = await this.order.findOne({
            where: {
                id: orderId
            },
            relations: ['orderItems', 'payment_detail', 'orderItems.product']
        })


        const payment = order.payment_detail.amount
        const product = order.orderItems[0].product
        const quantity = order.orderItems[0].quantity

        const checkoutCustomSession = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'pkr',
                        product_data: {
                            name: product.title,
                            description: product.description,
                            images: ["http://localhost:5005" + product.images[0]],
                        },

                        unit_amount: payment * 100,
                    },

                    quantity: quantity - 1,
                },
            ],
            mode: 'payment',
            success_url: "https://www.google.com/",//${request.get('host')}/stripe/redirect/success, // Replace with your success URL
            cancel_url: "https://instagram.com" //${request.get('host')}/stripe/redirect/failed, // Replace with your cancel URL
        });


        const id = checkoutCustomSession.id

        return checkoutCustomSession.url

    }

    async stripeRedirect(request, result): Promise<any> {
        if (result !== 'success') {
            throw new BadRequestException('Your payment could not be processed. Please try again');
        }
        const stripeSessionId = this.decrypt(request.session.stripeSessionId); // Implement your decryption logic here
        if (!stripeSessionId) {
            throw new BadRequestException('Your payment could not be processed. Please try again');
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET);

        try {
            const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);

            if (stripeSession.payment_status === 'paid') {
                const amount = stripeSession.amount_total / 100;

                const model = new Payment_Detail();

                // model.apply_for_rental_id = this.decrypt(request.session.id); // Implement your decryption logic here
                // model.user_id = request.user.id; // Assuming user info is available in the request
                // model.stripe_id = stripeSession.id;
                // model.amount = amount;
                // model.currency = stripeSession.currency;
                // model.object = stripeSession.object;
                // model.mode = stripeSession.mode;
                // model.intent_id = stripeSession.payment_intent;
                // model.status = stripeSession.payment_status;

                // await model.save();
                await this.wallet(request, amount);

                return model;
            } else {
                throw new BadRequestException('Your payment could not be processed. Please try again');
            }
        } catch (error) {
            throw new BadRequestException('Error processing payment');
        }
    }

    async wallet(request, amount): Promise<void> {
        // Implement wallet logic here
    }

    decrypt(data: string): string {
        // Implement decryption logic here
        return ''; // Return decrypted value
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
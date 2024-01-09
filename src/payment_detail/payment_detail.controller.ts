import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { PaymentDetailService } from './payment_detail.service';
import { Payment_Detail_Dto } from './payment_detail.dto';
import { sendJson } from 'src/helpers/helpers';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/user.entity';

@Controller('payment-detail')
export class PaymentDetailController {
    constructor(
        private payment_Detail_Service: PaymentDetailService
    ) { }

    @Get('session/:orderId')
    async getStripSession(@Param('orderId', ParseIntPipe) orderId: number) {
        const session = await this.payment_Detail_Service.checkoutSession(orderId)
        return sendJson(true, "Session Successfull", session)
    }


    @Post()
    @UseGuards(AuthGuard)
    async createPayment(@Body() paymentDto: Payment_Detail_Dto, @Request() req) {
        const authUser: UserEntity = req.user
        const payment = await this.payment_Detail_Service.create(paymentDto.orderId, paymentDto.payment, authUser)
        return sendJson(true, "Payment Successfull, Order completed", payment)
    }

}

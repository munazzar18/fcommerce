import { Module } from '@nestjs/common';
import { PaymentDetailController } from './payment_detail.controller';
import { PaymentDetailService } from './payment_detail.service';

@Module({
  imports:[],
  controllers: [PaymentDetailController],
  providers: [PaymentDetailService]
})
export class PaymentDetailModule {}

import { Module } from '@nestjs/common';
import { PaymentDetailController } from './payment_detail.controller';
import { PaymentDetailService } from './payment_detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment_Detail } from './payment_detail.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Payment_Detail])],
  controllers: [PaymentDetailController],
  providers: [PaymentDetailService]
})
export class PaymentDetailModule {}

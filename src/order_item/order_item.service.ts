import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order_Item } from './order_item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemService {
    constructor(
        @InjectRepository(Order_Item) private orderItemRepo: Repository<Order_Item>,
    ) { }


}

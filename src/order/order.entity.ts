import { Order_Item } from "src/order_item/order_item.entity";
import { Payment_Detail } from "src/payment_detail/payment_detail.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    total: number

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => Payment_Detail)
    @JoinColumn()
    payment_detail: Payment_Detail;

    @OneToMany(() => Order_Item, orderItem => orderItem.order)
    orderItems: Order_Item;

    @ManyToOne(()=> UserEntity, (user) => user.orders)
    user: UserEntity

   
}
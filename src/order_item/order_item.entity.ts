import { Order } from "src/order/order.entity";
import { Product } from "src/product/product.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Order_Item {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Order, order => order.orderItems)
    order: Order;

    @ManyToOne(() => Product, product => product.orderItems)
    product: Product;

}
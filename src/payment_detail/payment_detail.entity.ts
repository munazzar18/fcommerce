import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Status } from "./payment_status.enum";
import { Order } from "src/order/order.entity";


@Entity()
export class Payment_Detail {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column({type: 'enum', enum: Status, default: Status.Unpaid})
    status: Status;

    @Column()
    provider: string;

    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', onUpdate: 'timestamp' })
    updatedAt: Date;

    @OneToOne(() => Order, (order) => order.payment_detail)
    order: Order;
}
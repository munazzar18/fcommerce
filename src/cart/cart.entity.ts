
import { Product } from "src/product/product.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(()=> UserEntity, (user)=> user.cart)
    user: UserEntity

    @ManyToOne(() => Product, product => product.cart)
    product: Product;

}
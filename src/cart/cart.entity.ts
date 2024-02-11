
import { Product } from "src/product/product.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    quantity: number;

    @Column()
    totalPrice: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // @OneToMany(() => Product, (product) => product.cart)
    // @JoinColumn({ name: "productIds" })
    // products: Product[];

    @ManyToOne(() => Product, (product) => product.cart)
    @JoinColumn({ name: "productId" })
    product: Product;

    @ManyToOne(() => UserEntity, (user) => user.cart)
    @JoinColumn({ name: "userId" })
    user: UserEntity


}
import { Category } from "src/category/category.entity";
import { Product_Inventory } from "src/product_inventory/product_inventory.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";


@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Index({fulltext: true})
    @Column({nullable: false})
    title: string;

    @Index({fulltext: true})
    @Column({nullable: false})
    description: string;

    @Column({nullable: false})
    price: number;

    @Column('simple-array', {nullable: false})
    images: string[]

    @CreateDateColumn()
    created_at: Timestamp;

    @UpdateDateColumn()
    updated_at: Timestamp;

    @Column({nullable: false})
    userId: number;

    @Column({nullable: false})
    categoryId: number;

    @Column({nullable: false})
    product_inventory_id: number;

    @OneToOne(() => Product_Inventory, (product_inventory) => product_inventory.product)
    @JoinColumn({name: 'product_inventory_id'})
    product_inventory: Product_Inventory

    @ManyToOne(() => UserEntity, (user) => user.product)
    @JoinColumn({name: 'userId'})
    user: UserEntity;

    @ManyToOne(() => Category, (category) => category.product)
    @JoinColumn({name: "categoryId"})
    category: Category

}
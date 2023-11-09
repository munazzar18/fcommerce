import { Exclude } from "class-transformer";
import { Product } from "src/product/product.entity";
import { Role } from "src/roles/role.enum";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    email: string;

    @Column({nullable: false})
    firstName: string;

    @Column({nullable: false})
    lastName: string;

    @Column({nullable: false})
    mobile: string;

    @Column({nullable: false})
    address: string;

    @Column({nullable: false})
    password: string;

    @Column({type: 'enum', enum: Role, default: Role.User})
    roles: Role

    @OneToMany(() => Product, (product) => product.user)
    @JoinColumn({name: 'product'})
    product: Product[]
}

export class serializedUser {

    id: number;
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
    address: string;
    roles: Role;

    @Exclude()
    password: string

    constructor(partial: Partial<serializedUser>) {
        Object.assign(this, partial)
    }

}


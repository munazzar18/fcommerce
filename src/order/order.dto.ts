import { IsNotEmpty } from "class-validator";

export class createOrderDto {

    @IsNotEmpty()
    productIds: number[]

    @IsNotEmpty()
    quantity: number
}
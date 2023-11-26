import { IsNotEmpty } from "class-validator";

export class createOrderDto {

    @IsNotEmpty()
    orderItemId: number

    @IsNotEmpty()
    quantity: number
}
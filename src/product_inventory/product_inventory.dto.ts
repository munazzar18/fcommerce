import { IsNotEmpty } from "class-validator";


export class createInventoryDto {
    
    @IsNotEmpty()
    quantity: number
}
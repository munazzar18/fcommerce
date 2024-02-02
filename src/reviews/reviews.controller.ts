import { Body, Controller, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewDto } from './reviewDto.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(
        private reviewService: ReviewsService
    ) { }

    @Post()
    async create(@Body() reviewDto: ReviewDto) {
        const review = await this.reviewService.create(reviewDto.orderId)
        return review
    }



}

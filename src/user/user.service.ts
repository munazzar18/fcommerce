import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './registerUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity> 
        ){}

   async findAll(){
        return await this.userRepo.find()
   }

   async findOneById(id: number){
        return await this.userRepo.findOneBy({id})
   }

   async findOneByEmail(email: string){
    return await this.userRepo.findOneBy({email})
   }

   async create(data: RegisterUserDto){
     return await this.userRepo.save(data)
   }
}

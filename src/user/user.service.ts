import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './registerUser.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
     constructor(
          @InjectRepository(UserEntity)
          private userRepo: Repository<UserEntity>,
          private readonly mailerService: MailerService
     ) { }

     async findAll() {
          return await this.userRepo.find()
     }

     async findOneById(id: number) {
          return await this.userRepo.findOneBy({ id })
     }

     async findOneByEmail(email: string) {
          return await this.userRepo.findOneBy({ email })
     }

     async create(data: RegisterUserDto) {
          return await this.userRepo.save(data)
     }

     async sendMail() {
          await this.mailerService.sendMail({
               to: 'gex.18@hotmail.com', // List of receivers email address
               from: 'fcommerce@outlook.com', // Senders email address
               subject: 'Testing Nest MailerModule ✔', // Subject line
               text: 'welcome', // plaintext body
               html: '<b>welcome</b>', // HTML body content
          })
               .then((success) => {
                    console.log("Success:", success)
               })
               .catch((err) => {
                    console.log("ERROROOOOr:", err)
               });
          // await this.mailerService.sendMail({
          //      to: 'gex.18@hotmail.com',
          //      from: 'fcommerce@mail.com',
          //      subject: 'Testing Nest Js node mailer',
          //      text: 'Welcome',
          //      html: '<b>Testing Nest Js node mailer service!</b>'
          // })
          // return 'Email Sent successfully'
     }
}

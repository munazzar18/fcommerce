import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './registerUser.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Twilio } from 'twilio';


@Injectable()
export class UserService {
     private twilioClient: Twilio;
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

     async sendMail(email: string) {
          await this.mailerService.sendMail({
               to: email, // List of receivers email address
               from: 'fcommerce@outlook.com', // Senders email address
               subject: 'Testing Nest MailerModule ✔', // Subject line
               text: 'welcome', // plaintext body
               html: '<b>welcome</b>', // HTML body content
          })
               .then((success) => {
                    console.log("Success:", success)
               })
               .catch((err) => {
                    console.log("ERROR AYA HA:", err)
               });
     }

     async sendOTP(email: string, otp: string) {
          const currentTime = new Date().getTime()
          const user = await this.findOneByEmail(email)
          const expiry = user.expiry_otp
          const dbOtp = user.otp
          if (expiry >= currentTime) {
               if (otp === dbOtp) {
                    return await this.userRepo.save(user)
               }
               else {
                    throw new BadRequestException("OTP is incorrect")
               }
          } else {
               throw new BadRequestException("OTP Expired")
          }
     }
}

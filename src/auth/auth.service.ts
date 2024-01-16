import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { comparePass, encodedPass } from './bcrypt';
import { serializedUser } from 'src/user/user.entity';
import { RegisterUserDto } from 'src/user/registerUser.dto';
import { Twilio } from 'twilio';

@Injectable()
export class AuthService {
    private twilioClient: Twilio;
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const userDb = await this.userService.findOneByEmail(email)
        if (userDb) {
            const matched = comparePass(password, userDb.password)
            if (matched) {
                return new serializedUser(userDb)
            }
            else {
                throw new UnauthorizedException('Invalid Credentials')
            }
        }
        else {
            throw new UnauthorizedException('Invalid Credentials')
        }
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            id: user.id,
            username: user.firstName,
            role: user.roles
        }
        const accessToken = this.jwtService.sign(payload);
        return {
            access_token: accessToken,
            user: {
                email: payload.email,
                id: payload.id,
                username: payload.username,
                role: payload.role
            }
        }
    }
    async register(data: RegisterUserDto) {
        const userDb = await this.userService.findOneByEmail(data.email)
        if (userDb) {
            throw new HttpException('user with this email already exists', HttpStatus.CONFLICT)
        }
        else {
            const accountSid = process.env.TWILIO_SID
            const authToken = process.env.TWILIO_AUTH_TOKEN
            const client = this.twilioClient = new Twilio(accountSid, authToken);
            const OTP = Math.floor(100000 + Math.random() * 900000).toString()
            const currentTime = new Date().getTime()
            const expiryTime = currentTime + 180000
            await client.messages
                .create({
                    body: OTP,
                    from: process.env.TWILIO_NUMBER,
                    to: data.mobile
                })
            const password = encodedPass(data.password)
            let otp = OTP
            let expiry_otp = expiryTime
            const newUser = await this.userService.create({ ...data, password, otp, expiry_otp })
            // await this.userService.sendMail(data.email)
            const payload = {
                email: newUser.email,
                id: newUser.id,
                username: newUser.firstName,
                role: newUser.roles
            }
            const accessToken = this.jwtService.sign(payload);
            return {
                access_token: accessToken,
                user: {
                    email: payload.email,
                    id: payload.id,
                    username: payload.username,
                    role: payload.role
                }
            }
        }
    }

}

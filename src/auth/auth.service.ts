import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { comparePass, encodedPass } from './bcrypt';
import { serializedUser } from 'src/user/user.entity';
import { RegisterUserDto } from 'src/user/registerUser.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string){
        const userDb = await this.userService.findOneByEmail(email)
        if(userDb){
            const matched = comparePass(password, userDb.password)
            if(matched){
                return new serializedUser(userDb)
            }
            else {
                throw new UnauthorizedException('Invalid Password')
            }
        } 
        else {
            throw new UnauthorizedException('Invalid Email')
        }
    }

    async login(user: any){
        const payload = {
            email: user.email,
            id: user.id,
            username: user.firstName,
            role: user.roles
        }
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
    async register (data: RegisterUserDto){
        const userDb = await this.userService.findOneByEmail(data.email)
        if(userDb){
            throw new HttpException('user with this email already exists', HttpStatus.CONFLICT)
        }
        else {
            const password = encodedPass(data.password)
            const newUser = await this.userService.create({...data, password})
            const payload = {
                email: newUser.email,
                id: newUser.id,
                username: newUser.firstName,
                role: newUser.roles
            }
            return {
                access_token: this.jwtService.sign(payload)
            }
        }
    }

}

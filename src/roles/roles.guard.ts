
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService
  )
    {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles' , context.getHandler())

    const request = context.switchToHttp().getRequest()

    if(request?.user){
        const { id } = request.user

        const user = await this.userService.findOneById(id)
        return roles.includes(user.roles)
        // const userRoles = user.roles.map(role => role.toString())

        // return roles.some(role => userRoles.includes(role))
    }

    return false
  }
}
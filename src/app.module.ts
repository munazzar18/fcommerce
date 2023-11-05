import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './constants/jwtConstants';
import { DataSource } from 'typeorm';
import { UserEntity } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'fcommerce',
      autoLoadEntities: true,
      entities: [],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PassportModule,
    JwtModule.register({
      secret: JwtConstants.secret
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private datasource: DataSource){}
}

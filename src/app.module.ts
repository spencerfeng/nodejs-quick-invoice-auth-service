import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { User } from './users/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'auth-service-db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'auth-service-database',
      entities: [User],
      synchronize: true
    }),
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  constructor(private connection: Connection) {}
}

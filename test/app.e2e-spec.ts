import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { UsersModule } from '../src/users/users.module'
import { Connection } from 'typeorm'
import { User } from '../src/users/user.entity'
import { UserRepository } from '../src/users/user.repository'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let userRepository: UserRepository

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'auth-service-db',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'auth-service-database',
          entities: [User],
          synchronize: true
        })
      ]
    }).compile()

    app = moduleFixture.createNestApplication()
    userRepository = moduleFixture.get('UserRepository')
    await app.init()

    await userRepository.query('DELETE FROM user')
  })

  afterEach(async () => {
    await userRepository.query('DELETE FROM user')
  })

  afterAll(async () => {
    const connection = app.get(Connection)
    await connection.close()
    await app.close()
  })

  describe('/POST auth/login', () => {
    it('should return correct response if the login credentials are correct', async () => {
      await userRepository.save([
        {
          firstName: 'Apple',
          lastName: 'Seed',
          email: 'apple.seed@email.com',
          password: 'password'
        }
      ])

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'apple.seed@email.com', password: 'password' })
        .expect(201)
        .then(response => {
          expect(response.body).toHaveProperty('access_token')
        })
    })

    it('should return 401 if the login credentials are incorrect', async () => {
      await userRepository.save([
        {
          firstName: 'Apple',
          lastName: 'Seed',
          email: 'apple.seed@email.com',
          password: 'password'
        }
      ])

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'john.doe@email.com', password: 'password1' })
        .expect(401)
        .then(err => {
          expect(err.body).toEqual({
            statusCode: 401,
            message: 'Unauthorized'
          })
        })
    })
  })
})

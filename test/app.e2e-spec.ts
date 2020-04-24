import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  describe('/POST auth/login', () => {
    it('should return correct response if the login credentials are correct', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'john', password: 'changeme' })
        .expect(201)
        .then(response => {
          expect(response.body).toHaveProperty('access_token')
        })
    })

    it('should return 401 if the login credentials are incorrect', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'notexist@email.com', password: 'changeme' })
        .expect(401)
        .then(err => {
          expect(err.body).toEqual({
            statusCode: 401,
            message: 'Unauthorized'
          })
        })
    })
  })

  afterAll(async () => {
    await app.close()
  })
})

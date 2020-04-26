import { Test } from '@nestjs/testing'
import { JwtModule } from '@nestjs/jwt'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AuthService } from './auth/auth.service'
import { UsersService } from './users/users.service'
import { LocalStrategy } from './auth/local.strategy'
import { UserRepository } from '../test/mocks/user.repository'
import { User } from './users/user.entity'

describe('AppController', () => {
  let appController: AppController
  let authService: AuthService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'JWT_SECRET'
        })
      ],
      controllers: [AppController],
      providers: [
        AuthService,
        UsersService,
        LocalStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: UserRepository
        }
      ]
    }).compile()

    authService = moduleRef.get<AuthService>(AuthService)
    appController = moduleRef.get<AppController>(AppController)
  })

  describe('login', () => {
    it('should return the jwt token', async () => {
      const mockedReq = {
        user: {
          email: 'apple.seed@email.com',
          id: 1
        }
      }

      const result = {
        // eslint-disable-next-line @typescript-eslint/camelcase
        access_token: 'fake-token'
      }

      jest
        .spyOn(authService, 'login')
        .mockImplementation(() => Promise.resolve(result))

      expect(await appController.login(mockedReq)).toBe(result)
    })
  })

  describe('validateToken', () => {
    it('should return user info when there is a valid token', async () => {
      const mockedToken =
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4iLCJzdWIiOjEsImlhdCI6MTU4NzAyOTg0MSwiZXhwIjoxNTg3MDI5OTAxfQ.qeT50hYXfZrzpXJnT5OYtp7GJvlcM_Z497gwzCY5KCE'

      const result = {
        email: 'john.doe@email.com',
        id: 1
      }

      jest
        .spyOn(authService, 'validateToken')
        .mockImplementation(() => Promise.resolve(result))

      expect(await appController.validateToken(mockedToken)).toBe(result)
    })

    it('should throw an error if there is not a token', async () => {
      const mockedToken = ''

      try {
        expect(await appController.validateToken(mockedToken))
      } catch (err) {
        expect(err.status).toBe(401)
        expect(err.message).toBe('Unauthorized')
      }
    })
  })
})

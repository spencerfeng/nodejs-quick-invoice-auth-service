import { Test } from '@nestjs/testing'
import { JwtModule } from '@nestjs/jwt'
import { AppController } from './app.controller'
import { AuthService } from './auth/auth.service'
import { UsersService } from './users/users.service'
import { LocalStrategy } from './auth/local.strategy'

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
      providers: [AuthService, UsersService, LocalStrategy]
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
})

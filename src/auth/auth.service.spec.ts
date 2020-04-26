import { Test, TestingModule } from '@nestjs/testing'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { User } from '../users/user.entity'
import { UserRepository } from '../../test/mocks/user.repository'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('AuthService', () => {
  let service: AuthService
  let usersService: UsersService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'JWT_SECRET'
        })
      ],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: UserRepository
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)
  })

  describe('validateUser', () => {
    const mockedUser = new User()
    mockedUser.firstName = 'John'
    mockedUser.lastName = 'Doe'
    mockedUser.email = 'john.doe@email.com'
    mockedUser.password = 'password'
    mockedUser.id = '1234'

    it('should return a result with correct user information if a user can be found with the provided email and password', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(() => Promise.resolve(mockedUser))

      expect(
        await service.validateUser('john.doe@email.com', 'password')
      ).toEqual({
        email: 'john.doe@email.com',
        firstName: 'John',
        lastName: 'Doe',
        id: '1234'
      })
    })

    it('should return null if a user can not be found with the provided email and password', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockImplementation(() => Promise.resolve(undefined))

      expect(await service.validateUser('john.doe@email.com', 'password')).toBe(
        null
      )
    })
  })

  describe('login', () => {
    it('should return access_token', async () => {
      const mockedToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4iLCJzdWIiOjEsImlhdCI6MTU4NzAyOTg0MSwiZXhwIjoxNTg3MDI5OTAxfQ.qeT50hYXfZrzpXJnT5OYtp7GJvlcM_Z497gwzCY5KCE'
      jest.spyOn(jwtService, 'sign').mockImplementation(() => mockedToken)

      const mockedUser = {
        email: 'john.doe@email.com',
        userId: 1
      }

      expect(await service.login(mockedUser)).toEqual({
        // eslint-disable-next-line @typescript-eslint/camelcase
        access_token: mockedToken
      })
    })
  })

  describe('validateToken', () => {
    it('should return decoded token', async () => {
      const mockedToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4iLCJzdWIiOjEsImlhdCI6MTU4NzAyOTg0MSwiZXhwIjoxNTg3MDI5OTAxfQ.qeT50hYXfZrzpXJnT5OYtp7GJvlcM_Z497gwzCY5KCE'
      const mockedDecoded = {
        email: 'john.doe@email.com',
        sub: 1
      }
      jest
        .spyOn(jwtService, 'verify')
        .mockImplementation(() => Promise.resolve(mockedDecoded))

      expect(await service.validateToken(mockedToken)).toEqual({
        email: 'john.doe@email.com',
        id: 1
      })
    })
  })
})

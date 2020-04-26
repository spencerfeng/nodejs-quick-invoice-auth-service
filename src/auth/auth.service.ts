import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email)
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId }
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload)
    }
  }

  async validateToken(token: string): Promise<any> {
    const decoded = await this.jwtService.verify(token)
    return {
      email: decoded.email,
      id: decoded.sub
    }
  }
}

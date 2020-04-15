import {
  Controller,
  Post,
  UseGuards,
  Request,
  Headers,
  HttpCode,
  UnauthorizedException,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { AuthService } from './auth/auth.service'

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @HttpCode(200)
  @Post('auth/validate-token')
  async validateToken(@Headers('authorization') authorizationHeader: string) {
    if (!authorizationHeader) {
      throw new UnauthorizedException()
    }

    try {
      const token = authorizationHeader.substring(7)
      const userInfo = await this.authService.validateToken(token)
      return userInfo
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException()
      } else if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException()
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
    }
  }
}

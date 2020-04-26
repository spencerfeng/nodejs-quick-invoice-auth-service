import { Injectable } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { User } from './user.entity'

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findByEmail(email)
  }
}

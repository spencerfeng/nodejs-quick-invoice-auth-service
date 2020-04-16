import { Injectable } from '@nestjs/common'

export type User = any

@Injectable()
export class UsersService {
  private readonly users: User[]

  constructor() {
    this.users = [
      {
        userId: 1,
        email: 'john',
        password: 'changeme'
      },
      {
        userId: 2,
        email: 'chris',
        password: 'secret'
      },
      {
        userId: 3,
        email: 'maria',
        password: 'guess'
      }
    ]
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email)
  }
}

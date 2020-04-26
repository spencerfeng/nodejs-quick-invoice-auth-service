import { User } from '../../src/users/user.entity'

export class UserRepository {
  findByEmail(email: string) {
    const user = new User()
    user.firstName = 'John'
    user.lastName = 'Doe'
    user.email = email
    user.password = 'password'

    return user
  }
}

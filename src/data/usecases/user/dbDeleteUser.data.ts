import { IDeleteUserRepository } from '@/data/protocols/db/user/deleteUserRepository.interface'
import { IFindUserByIdRepository } from '@/data/protocols/db/user/findUserByIdRepository.interface'
import {
  IDeleteUser,
  IDeleteResult,
} from '@/domain/usecases/user/deleteUser.interface'

export class DbDeleteUser implements IDeleteUser {
  constructor(
    private readonly findUserByIdRepository: IFindUserByIdRepository,
    private readonly deleteUserRepository: IDeleteUserRepository
  ) {}

  async delete(id: number): Promise<IDeleteResult> {
    const user = await this.findUserByIdRepository.findId(id)

    if (!user) return { error: 'Não existe um usuário com este ID' }

    const deleted = await this.deleteUserRepository.delete(user.id)

    return { deleted }
  }
}

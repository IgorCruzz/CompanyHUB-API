import { BcryptAdapterStub, BcryptCompareStub } from '@/data/mocks/bcrypt.mock'
import {
  UpdateUserRepositoryStub,
  UserFindByEmailRepositoryStub,
  UserFindByIdRepositoryStub,
} from '@/data/mocks/user.mock'
import { ICompare } from '@/data/protocols/bcryptAdapter/ICompare.interface'
import { IHasher } from '@/data/protocols/bcryptAdapter/IHasher.interface'
import { IFindUserByIdRepository } from '@/data/protocols/db/user/findUserByIdRepository.interface'
import { IFindUserByEmailRepository } from '@/data/protocols/db/user/findUserRepository.inteface'
import { IUpdateUserRepository } from '@/data/protocols/db/user/updateUserRepository.interface'
import { IUpdateUser } from '@/domain/usecases/user/updateUser.interface'
import { DbUpdateUser } from '../dbUpdateUser.data'

let updateUserData: IUpdateUser
let userFindIdRepository: IFindUserByIdRepository
let userFindByEmailRepository: IFindUserByEmailRepository
let userUpdateRepository: IUpdateUserRepository
let bcryptCompare: ICompare
let bcryptHasher: IHasher

describe('UpdateUser Data', () => {
  beforeEach(() => {
    userFindIdRepository = new UserFindByIdRepositoryStub()
    userFindByEmailRepository = new UserFindByEmailRepositoryStub()
    userUpdateRepository = new UpdateUserRepositoryStub()
    bcryptCompare = new BcryptCompareStub()
    bcryptHasher = new BcryptAdapterStub()
    updateUserData = new DbUpdateUser(
      userFindIdRepository,
      userFindByEmailRepository,
      userUpdateRepository,
      bcryptCompare,
      bcryptHasher
    )
  })

  it('should be defined', () => {
    expect(updateUserData).toBeDefined()
  })

  it('should be able to call usersRepository with success', async () => {
    const res = jest.spyOn(userFindIdRepository, 'findId')

    await updateUserData.update(1, '1', { name: 'name' })

    expect(res).toHaveBeenCalledWith(1)
  })

  it('return null if usersRepository returns undefined', async () => {
    jest.spyOn(userFindIdRepository, 'findId').mockResolvedValue(undefined)

    const res = await updateUserData.update(1, '1', { name: 'name' })

    expect(res).toEqual({ error: 'Não existe um usuário com este ID.' })
  })

  it('return null if userFindByEmailRepository return an user with email passed on request', async () => {
    jest.spyOn(userFindByEmailRepository, 'findEmail').mockResolvedValue({
      id: 1,
      name: 'user',
      email: 'user@mail.com',
      password_hash: 'hashed_password',
      administrator: false,
      activation: false,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const res = await updateUserData.update(1, '1', {
      name: 'name',
      email: 'other@mail.com',
    })

    expect(res).toEqual({ error: 'Este e-mail já está em uso, escolha outro' })
  })

  it('should be able to call mockCompare with success', async () => {
    const res = jest.spyOn(bcryptCompare, 'compare')

    await updateUserData.update(1, '1', {
      name: 'name',
      email: 'user@mail.com',
      oldPassword: 'password',
      password: 'password',
      confirmPassword: 'password',
    })

    expect(res).toHaveBeenCalledWith('password', 'hashed_password')
  })

  it('should return null if mockCompare returns false', async () => {
    jest.spyOn(bcryptCompare, 'compare').mockResolvedValue(false)

    const res = await updateUserData.update(1, '1', {
      name: 'name',
      email: 'user@mail.com',
      oldPassword: 'password',
      password: 'password',
      confirmPassword: 'password',
    })

    expect(res).toEqual({ error: 'A senha está incorreta' })
  })

  it('should be able to call to UpdateUserRepository with success', async () => {
    const res = jest.spyOn(userUpdateRepository, 'update')

    await updateUserData.update(1, '1', { name: 'name_changed' })

    expect(res).toHaveBeenCalledWith(1, { name: 'name_changed' })
  })

  it('return null userId is different the user.id', async () => {
    const res = await updateUserData.update(1, '2', {
      name: 'name',
      email: 'other@mail.com',
    })

    expect(res).toEqual({
      error: 'Você não tem permissão para atualizar a conta de outro usuário.',
    })
  })

  it('should be able to call to UpdateUserRepository and changed the password', async () => {
    const res = jest.spyOn(userUpdateRepository, 'update')

    await updateUserData.update(1, '1', {
      oldPassword: 'password',
      password: 'newPassword',
      confirmPassword: 'newPassword',
    })

    expect(res).toBeTruthy()
  })
})

import { IDeleteUser } from '@/domain/usecases/user/deleteUser.interface'
import { BadRequest, Ok, ServerError } from '@/presentation/http/http-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '@/presentation/protocols'

export class DeleteUserController implements IController {
  constructor (private readonly deleteUser: IDeleteUser) {}

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const { id } = httpRequest.params

      const deleteUser = await this.deleteUser.delete(id)

      if (deleteUser.error) return BadRequest(deleteUser.error)

      return Ok({ message: 'Usuário deletado com sucesso.' })
    } catch (err) {
      return ServerError(err)
    }
  }
}

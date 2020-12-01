import { FindByUserRelationStub, FindUserIdRepositorytub } from "@/data/mocks/company.mock";
import { FindByProductCompanyIdStub } from "@/data/mocks/product.mock";
import { IFindByUserRelationRepository } from "@/data/protocols/db/company/findByUserRelationRepository";
import { IFindByProductCompanyId } from "@/data/protocols/db/product/findByProductCompanyIdRepository.interface";
import { IAddService } from "@/domain/usecases/service/addService.interface";
import { AddService } from "../createService.data";


let addService: IAddService
let findByUserRelation: IFindByUserRelationRepository
let findByProductCompanyId: IFindByProductCompanyId



describe('AddService Data', () => {
  beforeEach(() => {
    findByUserRelation = new FindByUserRelationStub()
    findByProductCompanyId = new FindByProductCompanyIdStub()
    addService = new AddService(findByUserRelation, findByProductCompanyId)
  });

  it('should be defined', () => {
    expect(addService).toBeDefined()
  })

  it('should call findByUserRelation with success', async () => {
    const res = jest.spyOn(findByUserRelation, 'findByUserRelation')

    await addService.add({
      name: 'company',
      description: 'description',
      user: '1',
      product_id: 1
    })

    expect(res).toHaveBeenCalledWith(1)
  })


  it('should call findByProductCompanyId with success', async () => {
    const res = jest.spyOn(findByProductCompanyId, 'findProductCompanyId')

    await addService.add({
      name: 'company',
      description: 'description',
      user: '1',
      product_id: 1
    })

    expect(res).toHaveBeenCalledWith({
      company_id: 1,
      product_id: 1
    })
  })

  it('should return an error message if product return undefined and user isnt an administrator', async () => {
    jest.spyOn(findByProductCompanyId, 'findProductCompanyId').mockResolvedValue(undefined)


    const res = await addService.add({
      name: 'company',
      description: 'description',
      user: '1',
      product_id: 1
    })

    expect(res).toEqual({
      error: 'Você não tem permissão para cadastrar um serviço neste produto.'
    })
  })
})
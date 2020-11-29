import { FindOneCompanyRepositoryStub } from "@/data/mocks/company.mock";
import { IFindOneCompanyRepository } from "@/data/protocols/db/company/findOneCompanyRepository.interface";
import { IUpdateCompany } from "@/domain/usecases/company/updateCompany.interace";
import { DbUpdateCompany } from "./updateCompany.data";

let dbUpdateCompany: IUpdateCompany
let findOneCompanyRepository: IFindOneCompanyRepository

describe('DbUpdateCompany Data', () => {
  beforeEach(() => {
    findOneCompanyRepository = new FindOneCompanyRepositoryStub()
    dbUpdateCompany = new DbUpdateCompany(findOneCompanyRepository)
  })

    it('should be defined', () => {
      expect(dbUpdateCompany).toBeDefined()
    })

    it('should call findOneCompanyRepository with success', async () => {
      const res = jest.spyOn(findOneCompanyRepository, 'findOne')

      await dbUpdateCompany.update(1, {
        name: 'company',
        cnpj: "111111111",
        user: "1"
      })

      expect(res).toHaveBeenCalledWith(1)
    })

    it('should returns an error message if findOneCompanyRepository returns undefined', async () => {
      jest.spyOn(findOneCompanyRepository, 'findOne').mockResolvedValue(undefined)

      const res = await dbUpdateCompany.update(1, {
        name: 'company',
        cnpj: "111111111",
        user: "1"
      })


      expect(res).toEqual({ error: 'Você não cadastrou sua empresa ainda.' })
    })

    it('should returns an error message if company belongs to another user', async () => {
      const res = await dbUpdateCompany.update(2, {
        name: 'company',
        cnpj: "111111111",
        user: "2"
      })

      expect(res).toEqual({ error: 'Você não tem permissão parar alterar dados de outra empresa.' })

    })
});
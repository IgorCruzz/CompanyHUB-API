import { ICreateProductDTO, ICreateProductRepository } from '@/data/protocols/db/product/createProductRepository.interface'
import { IDeleteProductRepository } from '@/data/protocols/db/product/deleteProductRepository.interface'
import { IProductFindAllRepository } from '@/data/protocols/db/product/findAllProductsRepository.interface'
import { IFindByIdRepository } from '@/data/protocols/db/product/findByIdRepository.interface'
import { IFindByProductNameRepository } from '@/data/protocols/db/product/findByNameProductRepository.interface'
import { IProductModel } from '@/domain/models/product.interface'
import { getRepository } from 'typeorm'
import { Product } from '../../entities/Product.entity'

export class ProductRepository
implements
  ICreateProductRepository,
  IFindByProductNameRepository,
  IFindByIdRepository,
  IDeleteProductRepository,
  IProductFindAllRepository {
  async create (date: ICreateProductDTO): Promise<IProductModel> {
    const orm = getRepository(Product)

    return await orm.save(date)
  }

  async findName (name: string): Promise<IProductModel> {
    const orm = getRepository(Product)

    return await orm.findOne({ name })
  }

  async findId (id: number): Promise<IProductModel> {
    const orm = getRepository(Product)

    return await orm.findOne({ name })
  }

  async delete (id: number): Promise<boolean> {
    const orm = getRepository(Product)

    const deleteCompany = await orm.delete(id)

    return deleteCompany && true
  }

  async findAll (): Promise<IProductModel[]> {
    const orm = getRepository(Product)

    return await orm.find({
      relations: ['serviceConnection', 'companyConnection'],
      order: {
        company_id: 'ASC'
      }
    })
  }
}

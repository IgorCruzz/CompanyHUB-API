import { connection } from '../../../../infra/db/typeorm/index'
import app from '../../../config/app'
import request from 'supertest'
import { getRepository } from 'typeorm'
import { User } from '@/infra/db/typeorm/entities/User.entity'
import { hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { Company } from '@/infra/db/typeorm/entities/Company.entity'
import { Product } from '@/infra/db/typeorm/entities/Product.entity'

jest.setTimeout(30000)

describe('Product', () => {
  beforeAll(async () => {
    await connection.create()
  })

  afterAll(async () => {
    await connection.close()
  })

  beforeEach(async () => {
    await getRepository(User).query(`DELETE FROM users`)
    await getRepository(Company).query(`DELETE FROM companies`)
    await getRepository(Product).query(`DELETE FROM products`)
  })

  afterEach(async () => {
    await getRepository(User).query(`DELETE FROM users`)
    await getRepository(Company).query(`DELETE FROM companies`)
    await getRepository(Product).query(`DELETE FROM products`)
  })

  describe('FindAll Product', () => {
    it('GET /products - 200', async () => {
      const password = await hash('password', 12)

      const user = await getRepository(User).save({
        name: 'Igor Oliveira da Cruz',
        email: 'igorcruz.dev@email.com',
        password_hash: password,
        activation: true,
        administrator: true,
      })

      const company = await getRepository(Company).save({
        name: 'Company',
        cnpj: '111111111111',
        user_id: user.id,
      })

      await getRepository(Product).save({
        name: 'product',
        company_id: company.id,
      })

      const authorization = sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN,
      })

      await request(app)
        .get(`/products`)
        .set('authorization', `Bearer ${authorization}`)
        .expect(200)
    })

    it('GET /products - 401', async () => {
      await request(app).get(`/products`).expect(401)
    })
  })
})

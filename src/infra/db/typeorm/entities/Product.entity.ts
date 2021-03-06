import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Company } from './Company.entity'
import { Service } from './Service.entity'

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column()
  company_id: number

  @ManyToOne(() => Company, (companies) => companies.productConnection)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  companyConnection?: Company

  @OneToMany(() => Service, (services) => services.productConnection)
  serviceConnection?: Service[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

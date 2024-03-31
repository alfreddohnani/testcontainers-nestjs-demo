import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '~/order/entities/order.entity';
import { Payment } from '~/payment/entities/payment.entity';

export enum UserTitle {
  MR = 'MR',
  MRS = 'MRS',
}

@Entity({ name: 'users' })
@Unique(['telephone'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  telephone: string;

  @Column({ type: 'integer' })
  age: number;

  @Column({ type: 'enum', enum: UserTitle })
  title: string;

  @OneToMany(() => Order, (order) => order.user, { nullable: true })
  orders?: Order[];

  @OneToMany(() => Payment, (payment) => payment.user, {
    nullable: true,
    onUpdate: 'CASCADE',
  })
  payments?: Payment[];

  @Column({ type: 'varchar' })
  password: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}

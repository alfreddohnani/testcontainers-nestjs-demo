import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { hashPassword } from '~/common/utils';
import { Order } from '~/order/entities/order.entity';
import { Payment } from '~/payment/entities/payment.entity';

export enum UserTitle {
  MR = 'MR',
  MRS = 'MRS',
}

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  firsName: string;

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

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      this.password = hashPassword({ plainPassword: this.password });
    }
  }
}

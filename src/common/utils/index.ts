import { genSaltSync, hashSync } from 'bcrypt';

import { ValidationError } from '@nestjs/common';
import { User } from '~/user/entities/user.entity';
import { PaginationOptionsDto } from './dto/pagination.dto';
import { Filter, Order } from 'typeorm-where';

export function getEnumKeys(enumType: any): string[] {
  return Object.keys(enumType).filter((key) => isNaN(+key));
}

export const generateRandom6Digits = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function hashPassword({
  plainPassword,
  rounds = 15,
}: {
  plainPassword: string;
  rounds?: number;
}) {
  const salt = genSaltSync(rounds);
  return hashSync(plainPassword, salt);
}

export function flattenValidationErrors(
  errors: ValidationError[] = [],
  prevMessages: string[] = [],
  parent: string = '',
): string[] {
  if (errors.length === 0) {
    return [];
  }
  let messages = [...prevMessages];
  errors.forEach(({ children, constraints, property }, i) => {
    const error = `${Object.values(constraints || {}).join(', ')}`;
    if (error) {
      messages.push(`${parent ? parent + '.' : ''}${property}: ${error}`);
    }
    if (children.length > 0) {
      const parent = errors[i].property;
      messages = flattenValidationErrors(children, messages, parent);
    }
  });
  return messages;
}

export function parseListDto<Entity>(dto: {
  filter?: string | Filter<Entity>;
  order?: string | Order<Entity>;
  paginateOptions: PaginationOptionsDto;
}) {
  return {
    paginateOptions: dto.paginateOptions,
    filter: dto?.filter ? JSON.parse(dto.filter as unknown as string) : {},
    order: dto?.order ? JSON.parse(dto.order as unknown as string) : {},
  } as {
    filter?: Filter<Entity>;
    order?: Order<Entity>;
    paginateOptions: PaginationOptionsDto;
  };
}

export function removeSensitiveData<T extends User>(user: T) {
  if (!user) return user;
  delete user.password;

  return user;
}

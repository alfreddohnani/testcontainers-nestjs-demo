import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined } from 'class-validator';
import {
  IPaginationMeta,
  IPaginationLinks,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Type } from '@nestjs/common';

export class PaginationMeta implements IPaginationMeta {
  itemCount: number;
  totalItems?: number;
  itemsPerPage: number;
  totalPages?: number;
  currentPage: number;
}

export function PaginateResult<T>(ItemType: Type<T>): any {
  abstract class PageClass {
    @ApiProperty({ type: () => [ItemType] })
    items: [];
    meta: PaginationMeta;
  }
  return PageClass;
}

export class PaginationLinks implements IPaginationLinks {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}

export class PaginationOptionsDto implements IPaginationOptions {
  /**Current page number */
  @IsNotEmpty()
  @IsDefined()
  page: string | number;

  /**Number of records to fetch per page */
  @IsNotEmpty()
  @IsDefined()
  limit: string | number;
}

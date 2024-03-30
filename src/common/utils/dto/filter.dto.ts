import { Filter, Order } from 'typeorm-where';

export abstract class FindOptionsDto<Entity> {
  filter?: Filter<Entity>;
  order?: Order<Entity>;
}

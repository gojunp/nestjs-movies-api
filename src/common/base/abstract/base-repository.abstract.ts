import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractBaseRepository<T> {
  abstract create(entity: DeepPartial<T>): T;
  abstract findOne(where: FindOneOptions<T>): Promise<T>;
  abstract createQueryBuilder(entity: string): SelectQueryBuilder<T>;
  abstract update(
    criteria: any,
    entity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;
  abstract find(where: FindManyOptions<T>): Promise<T[]>;
  abstract remove(criteria: FindOptionsWhere<T>): Promise<DeleteResult>;
  abstract count(where?: FindOptionsWhere<T>): Promise<number>;
  abstract createMany(entities: DeepPartial<T>[]): Promise<T[]>;
  abstract save(entity: DeepPartial<T>): Promise<T>;
}

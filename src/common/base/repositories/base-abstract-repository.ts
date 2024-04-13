import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AbstractBaseRepository } from '../abstract/base-repository.abstract';

/**
 * A base repository class providing generic implementations for common CRUD operations.
 * @typeparam T The entity type managed by the repository.
 */
export abstract class BaseRepository<T> extends AbstractBaseRepository<T> {
  /**
   * Constructor to initialize the repository with a TypeORM repository instance.
   * @param entity The TypeORM repository instance managing the entity.
   */
  constructor(private readonly entity: Repository<T>) {
    super();
  }

  /**
   * Creates a new entity instance and saves it to the database.
   * @param entity The data to create the entity with.
   * @returns A promise that resolves to the created entity.
   */
  create(entity: DeepPartial<T>): T {
    return this.entity.create(entity);
  }

  /**
   * Creates a new instance of a SelectQueryBuilder for the given entity.
   * @param entity The name of the entity to create the query builder for.
   * @returns A new instance of SelectQueryBuilder for the specified entity.
   */
  createQueryBuilder(entity: string): SelectQueryBuilder<T> {
    return this.entity.createQueryBuilder(entity);
  }

  /**
   * Finds the first entity that matches the specified conditions.
   * @param where The conditions to match against.
   * @returns A promise that resolves to the first matching entity, if found.
   */
  async findOne(where: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(where);
  }

  /**
   * Updates entities that match the specified criteria with the provided data.
   * @param criteria The criteria to match against.
   * @param entity The data to update the matching entities with.
   * @returns A promise that resolves to the update result.
   */
  async update(
    criteria: any,
    entity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return await this.entity.update(criteria, entity);
  }

  /**
   * Finds entities that match the specified conditions.
   * @param where The conditions to match against.
   * @returns A promise that resolves to an array of matching entities.
   */
  async find(where: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(where);
  }

  /**
   * Removes entities that match the specified criteria.
   * @param criteria The criteria to match against.
   * @returns A promise that resolves to the delete result.
   */
  async remove(criteria: FindOptionsWhere<T>): Promise<DeleteResult> {
    return await this.entity.delete(criteria);
  }

  /**
   * Counts entities that match the specified conditions.
   * @param where Optional conditions to match against.
   * @returns A promise that resolves to the count of matching entities.
   */
  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return await this.entity.count(where);
  }

  /**
   * Creates multiple new entity instances and saves them to the database.
   * @param entities The data to create the entities with.
   * @returns A promise that resolves to an array of created entities.
   */
  async createMany(entities: DeepPartial<T>[]): Promise<T[]> {
    const newEntities = this.entity.create(entities);
    return await this.entity.save(newEntities);
  }

  /**
   * Saves the provided entity to the database.
   * @param entity The entity to save.
   * @returns A promise that resolves to the saved entity.
   */
  async save(entity: DeepPartial<T>): Promise<T> {
    return await this.entity.save(entity);
  }
}

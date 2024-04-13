import { CreateGenreDto, UpdateGenreDto } from '../dto';
import { Genre } from '../entities/genre.entity';

export abstract class AbstractGenreService {
  abstract create(createGenreDto: CreateGenreDto): Promise<Genre>;
  abstract findAll(): Promise<Genre[]>;
  abstract findOne(id: number): Promise<Genre>;
  abstract update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre>;
  abstract remove(id: number): Promise<void>;
}

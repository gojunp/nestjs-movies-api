import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base-abstract-repository';
import { Genre } from '../entities/genre.entity';

export class AbstractGenreRepository extends BaseRepository<Genre> {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {
    super(genreRepository);
  }
}

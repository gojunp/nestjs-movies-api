import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base-abstract-repository';
import { Movie } from '../entities';

export class AbstractMovieRepository extends BaseRepository<Movie> {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {
    super(movieRepository);
  }
}

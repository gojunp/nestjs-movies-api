import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerService } from '../../common/loggers/winston-logger.service';
import { GenreModule } from '../genre/genre.module';
import { AbstractMovieRepository } from './abstract/movie.repository.abstract';
import { AbstractMovieService } from './abstract/movie.service.abstract';
import { Movie } from './entities';
import { MovieController } from './movie.controller';
import { MovieRepositoryService } from './services';
import { MovieSeederService } from './services/movie-seeder.service';
import { MovieService } from './services/movie.service';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), GenreModule],
  controllers: [MovieController],
  providers: [
    WinstonLoggerService,
    MovieSeederService,
    MovieService,
    MovieRepositoryService,
    { provide: AbstractMovieRepository, useClass: MovieRepositoryService },
    { provide: AbstractMovieService, useClass: MovieService },
  ],
  exports: [AbstractMovieRepository],
})
export class MovieModule {}

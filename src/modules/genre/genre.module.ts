import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonLoggerService } from '../../common/loggers/winston-logger.service';
import { AbstractGenreRepository } from './abstract/genre.repository.abstract';
import { AbstractGenreService } from './abstract/genre.service.abstract';
import { Genre } from './entities/genre.entity';
import { GenreController } from './genre.controller';
import { GenreRepositoryService } from './services';
import { GenreService } from './services/genre.service';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  controllers: [GenreController],
  providers: [
    WinstonLoggerService,
    GenreService,
    GenreRepositoryService,
    { provide: AbstractGenreRepository, useClass: GenreRepositoryService },
    { provide: AbstractGenreService, useClass: GenreService },
  ],
  exports: [AbstractGenreRepository],
})
export class GenreModule {}

import { Injectable } from '@nestjs/common';
import { AbstractGenreRepository } from '../abstract/genre.repository.abstract';

@Injectable()
export class GenreRepositoryService extends AbstractGenreRepository {}

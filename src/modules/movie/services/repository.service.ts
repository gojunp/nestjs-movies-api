import { Injectable } from '@nestjs/common';
import { AbstractMovieRepository } from '../abstract/movie.repository.abstract';

@Injectable()
export class MovieRepositoryService extends AbstractMovieRepository {}

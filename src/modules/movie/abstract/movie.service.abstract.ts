import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { PageDto } from '../../../common/dtos/page.dto';
import { CreateMovieDto, GetMoviesArgs, UpdateMovieDto } from '../dto';
import { Movie } from '../entities';

export abstract class AbstractMovieService {
  abstract create(createMovieDto: CreateMovieDto): Promise<Movie>;
  abstract findOne(id: number): Promise<Movie>;
  abstract findByTitleAndGenre(getMoviesArgs: GetMoviesArgs): Promise<Movie[]>;
  abstract listEntities(
    getMoviesArgs: GetMoviesArgs,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Movie>>;
  abstract update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie>;
  abstract remove(id: number): Promise<void>;
  abstract removeGenreFromMovie(
    movieId: number,
    genreName: string,
  ): Promise<Movie>;
  abstract addGenresToMovie(
    movieId: number,
    genreNames: string[],
  ): Promise<Movie>;
}

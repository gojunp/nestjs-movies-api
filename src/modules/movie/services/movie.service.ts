import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { PageMetaDto } from '../../../common/dtos/page-meta.dto';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto';
import { PageDto } from '../../../common/dtos/page.dto';
import { MovieApiNotFoundException } from '../../../common/exceptions/custom.exception';
import { AbstractGenreRepository } from '../../genre/abstract/genre.repository.abstract';
import { AbstractMovieRepository } from '../abstract/movie.repository.abstract';
import { AbstractMovieService } from '../abstract/movie.service.abstract';
import { GetMoviesArgs } from '../dto';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { Movie } from '../entities';

@Injectable()
export class MovieService extends AbstractMovieService {
  constructor(
    private readonly movieRepository: AbstractMovieRepository,
    private readonly genreRepository: AbstractGenreRepository,
  ) {
    super();
  }

  /**
   * Creates a movie and saves it to the database
   * @param createMovieDto - create movie dto
   * @returns movie
   */
  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { genreNames } = createMovieDto;

    // If genre names provided, find or create genres
    if (genreNames) {
      const movieGenres = await this.genreRepository.find({
        where: { name: In(genreNames) },
      });
      if (movieGenres.length !== genreNames.length) {
        for (const genre of genreNames) {
          if (!movieGenres.some((mg) => mg.name === genre)) {
            const genreObj = this.genreRepository.create({ name: genre });
            const newGenre = await this.genreRepository.save(genreObj);
            movieGenres.push(newGenre);
          }
        }
      }

      console.log(movieGenres);

      const movieObj = this.movieRepository.create({
        ...createMovieDto,
        genres: movieGenres,
      });

      console.log(movieObj);

      return await this.movieRepository.save(movieObj);
    } else {
      const movieObj = this.movieRepository.create(createMovieDto);
      return await this.movieRepository.save(movieObj);
    }
  }

  /**
   * Gets movies by title and genre
   * @param getMoviesArgs - get movies args
   * @returns array of movies
   */
  async findByTitleAndGenre(getMoviesArgs: GetMoviesArgs): Promise<Movie[]> {
    const { title, genre } = getMoviesArgs;

    return await this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .where('movie.title ILIKE :title', { title: title ? `%${title}%` : '%' })
      .andWhere('genre.name ILIKE :name', {
        name: genre ? `%${genre}%` : '%',
      })
      .getMany();
  }

  /**
   * Gets a movie by id
   * @param id - movie id
   * @returns movie
   */
  async findOne(id: number): Promise<Movie> {
    const result = await this.movieRepository.findOne({
      where: { id },
      relations: { genres: true },
    });
    if (!result) throw new MovieApiNotFoundException('Movie Not Found.');
    return result;
  }

  /**
   * Lists all movies into a pagination
   * @param pageOptionsDto - page options dto
   * @param sortCriteria - sort criteria
   * @returns paginated list of movies
   */
  async listEntities(
    getMoviesArgs: GetMoviesArgs,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Movie>> {
    const { take, skip, sort } = pageOptionsDto;
    const { title, genre } = getMoviesArgs;

    // Set sortable properties
    const movieSortProperties: string[] = [
      'title',
      'createdAt',
      'updatedAt',
      'releaseDate',
    ];
    const orderBy = this.createListSortObject(sort, movieSortProperties);

    // Build the query for fetching movies with genres, enable filtering by movie name and genre title
    const query = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .where('movie.title ILIKE :title', { title: title ? `%${title}%` : '%' })
      .andWhere('genre.name ILIKE :name', {
        name: genre ? `%${genre}%` : '%',
      });

    const { entities } = await query
      .orderBy(orderBy)
      .take(take)
      .skip(skip)
      .getRawAndEntities();

    const itemCount = await query.getCount();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  private createListSortObject(
    sort: string,
    sortableProperties: string[],
  ): { [t: string]: 'ASC' | 'DESC' } {
    const sortArray = sort.split(',');

    // Create an object to store the sort directions
    const sortObj: Record<string, 'ASC' | 'DESC'> = {};

    sortArray.forEach((sortItem) => {
      // Check if the sort item matches the pattern
      const match = sortItem.match(/^([+-])(\w+)$/);
      if (match) {
        const [, sign, field] = match;
        // Ensure that the field is a valid column in the Movie entity
        if (sortableProperties.includes(field)) {
          sortObj[`movie.${field}`] = sign === '-' ? 'DESC' : 'ASC';
        }
      }
    });

    // Use sortObj to construct the result object and return it
    return Object.fromEntries(
      Object.entries(sortObj).map(([field, direction]) => [field, direction]),
    );
  }

  /**
   * Updates a movie entry by id
   * @param id - movie id
   * @param updateMovieDto - update movie dto
   * @returns updated movie
   */
  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    console.log(updateMovieDto);
    const result = await this.movieRepository.findOne({
      where: { id },
    });
    if (!result) throw new MovieApiNotFoundException('Movie Not Found.');

    const updatedMovie = {
      ...result,
      ...updateMovieDto,
    };
    console.log(updatedMovie);
    await this.movieRepository.update(result.id, updatedMovie);
    return updatedMovie;
  }

  /**
   * Removes a movie from the database by id
   * @param id - movie id
   * @returns Void
   */
  async remove(id: number): Promise<void> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) throw new MovieApiNotFoundException('Movie not found');

    await this.movieRepository.remove({ id });
  }
  /**
   * Adds one or more genres to a movie
   * @param movieId - movie id
   * @param genreNames - list of genre names
   * @returns movie
   */
  async addGenresToMovie(
    movieId: number,
    genreNames: string[],
  ): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
      relations: { genres: true },
    });
    if (!movie) {
      throw new MovieApiNotFoundException(`Movie with ID ${movieId} not found`);
    }

    const genres = await this.genreRepository.find({
      where: { name: In(genreNames) },
    });
    if (genres.length !== genreNames.length) {
      throw new MovieApiNotFoundException(`One or more genres not found`);
    }

    // If some of genres not present, add them to the movie
    for (const genre of genres) {
      if (!movie.genres.find((g) => g.name === genre.name)) {
        movie.genres.push(genre);
      }
    }
    return await this.movieRepository.save(movie);
  }

  /**
   * Removes a genre from a movie
   * @param movieId - movie id
   * @param genreName - genre name
   * @returns movie
   */
  async removeGenreFromMovie(
    movieId: number,
    genreName: string,
  ): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
      relations: { genres: true },
    });
    if (!movie) {
      throw new MovieApiNotFoundException(`Movie with ID ${movieId} not found`);
    }

    this.checkIfMoveContainsGenre(movie, genreName);

    return await this.movieRepository.save(movie);
  }

  /**
   * Check if genre is associated with the movie and remove it
   * @param movie - movie object
   * @param genreName - genre name
   */
  private checkIfMoveContainsGenre(movie: Movie, genreName: string): void {
    const genreIndex = movie.genres.findIndex((g) => g.name === genreName);
    if (genreIndex === -1) {
      throw new MovieApiNotFoundException(
        `Genre named ${genreName} is not associated with the movie`,
      );
    }

    movie.genres.splice(genreIndex, 1);
  }
}

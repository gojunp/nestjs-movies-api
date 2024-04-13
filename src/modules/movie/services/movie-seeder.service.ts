import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DeepPartial } from 'typeorm';
import { Logger } from 'winston';
import { AbstractGenreRepository } from '../../genre/abstract/genre.repository.abstract';
import { Genre } from '../../genre/entities/genre.entity';
import { AbstractMovieRepository } from '../abstract/movie.repository.abstract';
import { Movie } from '../entities';

const movies: DeepPartial<Movie>[] = [
  {
    title: 'The Hangover',
    description: 'A comedy film about a wild bachelor party in Las Vegas.',
    genres: [{ name: 'Comedy' }],
    releaseDate: new Date('2009-06-05'),
  },
  {
    title: 'Superbad',
    description: 'Teen comedy film about two high school friends.',
    genres: [{ name: 'Comedy' }],
    releaseDate: new Date('2007-08-17'),
  },
  {
    title: 'Deadpool',
    description: 'Action-packed superhero film with a comedic twist.',
    genres: [{ name: 'Action' }, { name: 'Comedy' }],
    releaseDate: new Date('2016-02-12'),
  },
  {
    title: 'Die Hard',
    description: 'Classic action film starring Bruce Willis as John McClane.',
    genres: [{ name: 'Action' }, { name: 'Thriller' }],
    releaseDate: new Date('1988-07-15'),
  },
  {
    title: 'The Exorcist',
    description: 'Horror film about a young girl possessed by a demon.',
    genres: [{ name: 'Horror' }],
    releaseDate: new Date('1973-12-26'),
  },
  {
    title: 'The Shining',
    description: "Psychological horror film based on Stephen King's novel.",
    genres: [{ name: 'Horror' }, { name: 'Thriller' }],
    releaseDate: new Date('1980-05-23'),
  },
  {
    title: 'March of the Penguins',
    description: 'Documentary following the journey of emperor penguins.',
    genres: [{ name: 'Documentary' }],
    releaseDate: new Date('2005-01-26'),
  },
  {
    title: 'Planet Earth',
    description:
      "Nature documentary series showcasing Earth's diverse habitats.",
    genres: [{ name: 'Documentary' }],
    releaseDate: new Date('2006-03-05'),
  },
  {
    title: 'The Shawshank Redemption',
    description:
      "Drama film based on Stephen King's novella about a banker who is wrongly convicted of murder.",
    genres: [{ name: 'Drama' }],
    releaseDate: new Date('1994-10-14'),
  },
  {
    title: 'Forrest Gump',
    description:
      'Drama film about a man with a low IQ who witnesses and unwittingly influences several historical events.',
    genres: [{ name: 'Drama' }, { name: 'Romance' }],
    releaseDate: new Date('1994-07-06'),
  },
  {
    title: 'The Silence of the Lambs',
    description:
      'Psychological thriller about an FBI trainee seeking the help of a cannibalistic serial killer to catch another serial killer.',
    genres: [{ name: 'Thriller' }, { name: 'Horror' }],
    releaseDate: new Date('1991-02-14'),
  },
  {
    title: 'Seven',
    description:
      'Thriller film about two detectives tracking down a serial killer who uses the seven deadly sins as his motives.',
    genres: [{ name: 'Thriller' }, { name: 'Drama' }],
    releaseDate: new Date('1995-09-22'),
  },
  {
    title: 'Inception',
    description:
      'Sci-fi thriller about a thief who enters the dreams of others to steal their secrets.',
    genres: [{ name: 'Sci-Fi' }, { name: 'Thriller' }],
    releaseDate: new Date('2010-07-16'),
  },
  {
    title: 'The Matrix',
    description:
      'Sci-fi action film about a computer hacker who learns about the true nature of reality.',
    genres: [{ name: 'Sci-Fi' }, { name: 'Action' }],
    releaseDate: new Date('1999-03-31'),
  },
  {
    title: 'Toy Story',
    description:
      "Animated film about a group of toys that come to life when humans aren't present.",
    genres: [{ name: 'Animated' }, { name: 'Comedy' }],
    releaseDate: new Date('1995-11-22'),
  },
  {
    title: 'Finding Nemo',
    description:
      'Animated film about a clownfish searching for his son who was captured by a diver.',
    genres: [{ name: 'Animated' }, { name: 'Family' }],
    releaseDate: new Date('2003-05-30'),
  },
];

@Injectable()
export class MovieSeederService implements OnApplicationBootstrap {
  constructor(
    private readonly movieRepository: AbstractMovieRepository,
    private readonly genreRepository: AbstractGenreRepository,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) public readonly logger: Logger,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      const movieCount = await this.movieRepository.count();
      if (movieCount < 1) {
        const moviesToSave = [];

        for (const movieData of movies) {
          const movie = new Movie();
          movie.title = movieData.title;
          movie.description = movieData.description;
          movie.releaseDate = movieData.releaseDate as Date;
          movie.genres = [];

          for (const movieGenre of movieData.genres) {
            let genre = await this.genreRepository.findOne({
              where: { name: movieGenre.name },
            });

            if (!genre) {
              genre = new Genre();
              genre.name = movieGenre.name;
              await this.genreRepository.create(genre);
            }

            movie.genres.push(genre);
          }

          moviesToSave.push(movie);
        }

        await this.movieRepository.createMany(moviesToSave);
      }
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}

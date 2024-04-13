import { IGenre } from '../../genre/interfaces/genre.entity.interface';

export interface IMovie {
  id: number;
  title: string;
  description: string;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  genres: IGenre[];
}

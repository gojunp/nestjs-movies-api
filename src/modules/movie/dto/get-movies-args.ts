import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IMovie } from '../interfaces/movie.entity.interface';

export class GetMoviesArgs implements Partial<IMovie> {
  @ApiPropertyOptional({ description: 'Movie title' })
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Movie genre name' })
  @IsString({ message: 'Genre must be a string' })
  @IsOptional()
  genre?: string;
}

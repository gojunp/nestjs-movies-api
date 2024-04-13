import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenreResponse } from '../../genre/response/genre.response';

export class MovieResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Movie Title' })
  title: string;

  @ApiProperty({ example: 'Movie Description' })
  description: string;

  @ApiProperty({ example: 'Movie Release Date' })
  releaseDate: Date;

  @ApiProperty({ example: 'Time of movie creation' })
  createdAt: Date;

  @ApiProperty({ example: 'Time of movie update' })
  updatedAt: Date;

  @ApiPropertyOptional({ example: [GenreResponse], type: [GenreResponse] })
  genres?: GenreResponse[];
}

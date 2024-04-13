import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { IMovie } from '../interfaces/movie.entity.interface';

export class GetMovieArgs implements Partial<IMovie> {
  @ApiProperty()
  @IsNumberString({}, { message: 'Please provide a valid ID' })
  id: number;
}

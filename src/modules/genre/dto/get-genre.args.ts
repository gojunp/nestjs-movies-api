import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { IGenre } from '../interfaces/genre.entity.interface';

export class GetGenreArgs implements Partial<IGenre> {
  @ApiProperty()
  @IsNumberString({}, { message: 'Please provide a valid ID' })
  id: number;
}

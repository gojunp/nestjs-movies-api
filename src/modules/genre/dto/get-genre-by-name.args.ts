import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IGenre } from '../interfaces/genre.entity.interface';

export class GetGenreByNameArgs implements Partial<IGenre> {
  @ApiProperty()
  @IsString({ message: 'Please provide an name' })
  @IsNotEmpty()
  name: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IGenre } from '../interfaces/genre.entity.interface';

export class CreateGenreDto implements Partial<IGenre> {
  @ApiProperty({ example: 'Genre name' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(20, { message: 'Name must be less than 20 characters' })
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;
}

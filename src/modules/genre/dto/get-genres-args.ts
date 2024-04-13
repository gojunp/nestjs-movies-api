import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class GetGenresByNamesArgs {
  @ApiProperty({})
  @IsString({ each: true, message: 'Please provide a name' })
  @IsArray({ message: 'Please provide a list of names' })
  genres: string[];
}

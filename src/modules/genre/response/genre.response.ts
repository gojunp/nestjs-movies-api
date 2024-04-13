import { ApiProperty } from '@nestjs/swagger';

export class GenreResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Genre name' })
  name: string;

  @ApiProperty({ example: 'Time of genre creation' })
  createdAt: Date;

  @ApiProperty({ example: 'Time of genre update' })
  updatedAt: Date;
}

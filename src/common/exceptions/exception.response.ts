import { ApiProperty } from '@nestjs/swagger';
import { ExceptionOrigin } from '../constants/exception.origin.enum';

export class MovieApiExceptionResponse {
  @ApiProperty({ enum: ExceptionOrigin })
  origin: ExceptionOrigin;

  @ApiProperty({
    description: 'HTTP-compatible status code',
  })
  status: number;

  @ApiProperty()
  code: string;

  @ApiProperty({ description: 'Exception name' })
  exception: string;

  @ApiProperty({
    description: 'Human-readable error message',
  })
  detail: string;
}

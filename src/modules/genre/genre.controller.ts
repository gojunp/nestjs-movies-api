import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MovieApiExceptionResponse } from '../../common/exceptions/exception.response';
import { GetMovieArgs } from '../movie/dto';
import { AbstractGenreService } from './abstract/genre.service.abstract';
import { GetGenreArgs } from './dto';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreResponse } from './response/genre.response';

@ApiTags('Genres')
@Controller('genres')
@ApiResponse({
  description: 'Non-2XX response',
  type: MovieApiExceptionResponse,
})
export class GenreController {
  constructor(private readonly genreService: AbstractGenreService) {}

  @Post()
  @ApiOperation({ summary: 'Create a genre' })
  @ApiResponse({
    status: 201,
    description: 'Genre has been successfully created',
    type: GenreResponse,
  })
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  @ApiOkResponse({
    status: 200,
    description: 'List of genres',
    type: [GenreResponse],
  })
  findAll() {
    return this.genreService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a genre by ID' })
  @ApiOkResponse({
    status: 200,
    description: 'Found an entry',
    type: GenreResponse,
  })
  findOne(@Param() args: GetGenreArgs) {
    return this.genreService.findOne(args.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a genre by ID' })
  @ApiResponse({
    status: 200,
    description: 'The entry has been successfully updated',
    type: GenreResponse,
  })
  update(@Param() args: GetMovieArgs, @Body() updateGenreDto: UpdateGenreDto) {
    return this.genreService.update(args.id, updateGenreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a genre by ID' })
  @ApiResponse({
    status: 204,
    description: 'The entry has been successfully deleted',
  })
  @HttpCode(204)
  remove(@Param() args: GetGenreArgs) {
    return this.genreService.remove(args.id);
  }
}

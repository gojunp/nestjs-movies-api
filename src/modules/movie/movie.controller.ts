import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { PageDto } from '../../common/dtos/page.dto';
import { MovieApiExceptionResponse } from '../../common/exceptions/exception.response';
import { GetGenresByNamesArgs } from '../genre/dto';
import { GetGenreByNameArgs } from '../genre/dto/get-genre-by-name.args';
import { AbstractMovieService } from './abstract/movie.service.abstract';
import { GetMovieArgs, GetMoviesArgs } from './dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities';
import { MovieResponse } from './response/movie.response';

@ApiTags('Movies')
@Controller('movies')
@ApiResponse({
  description: 'Non-2XX response',
  type: MovieApiExceptionResponse,
})
export class MovieController {
  constructor(private readonly movieService: AbstractMovieService) {}

  @Post()
  @ApiOperation({ summary: 'Create a movie' })
  @ApiResponse({
    status: 201,
    description: 'Movie has been successfully created',
    type: MovieResponse,
  })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.movieService.create(createMovieDto);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(MovieResponse)
  @ApiOperation({ summary: 'Find movies by title and genre' })
  async findByTitleAndGenre(
    @Query() getMoviesArgs: GetMoviesArgs,
  ): Promise<Movie[]> {
    return this.movieService.findByTitleAndGenre(getMoviesArgs);
  }

  @Get('/paginate')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(MovieResponse)
  @ApiOperation({ summary: 'Paginate Movies' })
  async paginateMovies(
    @Query() getMoviesArgs: GetMoviesArgs,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Movie>> {
    return this.movieService.listEntities(getMoviesArgs, pageOptionsDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movie by ID' })
  @ApiOkResponse({
    status: 200,
    description: 'Found an entry',
    type: MovieResponse,
  })
  findOne(@Param() args: GetMovieArgs) {
    return this.movieService.findOne(args.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'The entry has been successfully updated',
    type: MovieResponse,
  })
  update(@Param() args: GetMovieArgs, @Body() updateMovieDto: UpdateMovieDto) {
    return this.movieService.update(args.id, updateMovieDto);
  }

  @Post(':id/genres')
  @ApiOperation({ summary: 'Add a genre to a movie' })
  @ApiResponse({
    status: 200,
    description: 'The entry has been successfully updated',
    type: MovieResponse,
  })
  async addGenreToMovie(
    @Param() params: GetMovieArgs,
    @Body() { genres }: GetGenresByNamesArgs,
  ) {
    return this.movieService.addGenresToMovie(params.id, genres);
  }

  @Delete(':id/genres/:name')
  @ApiOperation({ summary: 'Delete a genre from a movie' })
  @ApiResponse({
    status: 200,
    description: 'The entry has been successfully updated',
    type: MovieResponse,
  })
  async removeGenreFromMovie(
    @Param() params: GetMovieArgs,
    @Param() movieParams: GetGenreByNameArgs,
  ) {
    return this.movieService.removeGenreFromMovie(params.id, movieParams.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie by ID' })
  @ApiResponse({
    status: 204,
    description: 'The entry has been successfully deleted',
  })
  @HttpCode(204)
  remove(@Param() args: GetMovieArgs) {
    return this.movieService.remove(args.id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MovieApiNotFoundException } from '../../../common/exceptions/custom.exception';
import { AbstractGenreRepository } from '../abstract/genre.repository.abstract';
import { AbstractGenreService } from '../abstract/genre.service.abstract';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { UpdateGenreDto } from '../dto/update-genre.dto';
import { Genre } from '../entities/genre.entity';

@Injectable()
export class GenreService extends AbstractGenreService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: AbstractGenreRepository,
  ) {
    super();
  }

  /**
   * Creates a genre and saves it to the database
   * @param createGenreDto - create genre dto
   * @returns genre
   */
  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const result = this.genreRepository.create(createGenreDto);
    return await this.genreRepository.save(result);
  }

  /**
   * Gets all genres from the database
   * @returns array of genres
   */
  async findAll(): Promise<Genre[]> {
    const result = await this.genreRepository.find({});
    if (!result) throw new NotFoundException('Genres Not Found.');
    return result;
  }

  /**
   * Gets a genre by id
   * @param id - genre id
   * @returns genre
   */
  async findOne(id: number): Promise<Genre> {
    const result = await this.genreRepository.findOne({
      where: { id },
    });
    if (!result) throw new NotFoundException('Genre Not Found.');
    return result;
  }

  /**
   * Updates a genre entry by id
   * @param id - genre id
   * @param updateGenreDto - update genre dto
   * @returns updated genre
   */
  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const result = await this.genreRepository.findOne({
      where: { id },
    });
    if (!result) throw new NotFoundException('Genre Not Found.');

    const updatedGenre = {
      ...result,
      ...updateGenreDto,
    };
    await this.genreRepository.update(updatedGenre.id, updatedGenre);
    return updatedGenre;
  }

  /**
   * Removes a genre from the database by id
   * @param id - genre id
   * @returns Void
   */
  async remove(id: number): Promise<void> {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) throw new MovieApiNotFoundException('Genre not found');

    await this.genreRepository.remove({ id });
  }
}

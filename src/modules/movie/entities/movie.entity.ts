import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from '../../genre/entities/genre.entity';
import { IMovie } from '../interfaces/movie.entity.interface';

@Entity({ name: 'movie' })
export class Movie implements IMovie {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Movie Title' })
  @Column({ type: 'varchar', length: 100 })
  title: string;

  @ApiProperty({ example: 'Movie Description' })
  @Column({ type: 'varchar', length: 200 })
  description: string;

  @ApiProperty({ example: 'Movie Release Date' })
  @Column({ type: 'timestamptz', name: 'release_date' })
  releaseDate: Date;

  @ApiProperty({ example: 'Time of movie creation' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: 'Time of movie update' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => Genre, { cascade: true })
  @JoinTable()
  genres: Genre[];
}

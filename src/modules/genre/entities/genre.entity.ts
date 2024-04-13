import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IGenre } from '../interfaces/genre.entity.interface';

@Entity({ name: 'genre' })
export class Genre implements IGenre {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Genre name' })
  @Column({ type: 'varchar', length: 20, unique: true })
  name: string;

  @ApiProperty({ example: 'Time of genre creation' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: 'Time of genre update' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

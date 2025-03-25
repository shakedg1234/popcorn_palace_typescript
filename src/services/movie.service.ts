import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../models/movie.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }
  async findOne(id: number): Promise<Movie | null> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      console.warn(`Movie with id ${id} not found.`);
    }
    return movie;
  }
  
  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    try {
        return await this.movieRepository.save(movie);
      } catch (error) {
        if (error.code === '23505') {
          throw new BadRequestException('A movie with this title already exists');
        }
        throw error;
      }  }
  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new Error(`Movie with ID ${id} not found`);
    }
  
    const updated = Object.assign(movie, updateMovieDto);
    return this.movieRepository.save(updated);
  }
  async updateByTitle(title: string, dto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { title } });
  
    if (!movie) {
      throw new NotFoundException(`Movie with title "${title}" not found`);
    }
  
    if (dto.title && dto.title !== movie.title) {
      const existingWithSameTitle = await this.movieRepository.findOne({
        where: { title: dto.title },
      });
  
      if (existingWithSameTitle) {
        throw new BadRequestException(
          `A movie with title "${dto.title}" already exists`,
        );
      }
    }
  
    const updated = Object.assign(movie, dto);
    return this.movieRepository.save(updated);
  }
  
  async deleteOne(id: number): Promise<boolean> {
    const result = await this.movieRepository.delete(id);
  
    if (result.affected === 0) {
      console.warn(`Movie with ID ${id} not found.`);
      return false;
    }
  
    console.log(`🎬 Movie with ID ${id} deleted`);
    return true;
  }
  async deleteByTitle(title: string): Promise<boolean> {
    const result = await this.movieRepository.delete({ title });
    return result.affected > 0;
  }
  
  
}

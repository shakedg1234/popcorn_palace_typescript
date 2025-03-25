import { Injectable } from '@nestjs/common';
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
    return this.movieRepository.save(movie);
  }
  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new Error(`Movie with ID ${id} not found`);
    }
  
    const updated = Object.assign(movie, updateMovieDto);
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
  
}

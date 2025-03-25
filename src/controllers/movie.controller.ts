import { Controller, Get, Post,Param ,Delete,Put, Body,NotFoundException } from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
async getAllMovies(): Promise<Movie[]> {
  console.log('Fetching all movies...');
  const movies = await this.movieService.findAll();
  console.log('Movies:', movies);
  return movies;
}
@Get(':id')
async getMovieById(@Param('id') id: string): Promise<Movie> {
    console.log(`Fetching movie with ID: ${id}`);
    const movie = await this.movieService.findOne(Number(id));
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  @Post()
  async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }
  @Put(':id')
async updateMovie(
  @Param('id') id: string,
  @Body() updateMovieDto: UpdateMovieDto,
): Promise<Movie> {
  return this.movieService.update(Number(id), updateMovieDto);
}
@Delete(':id')
async deleteMovieById(@Param('id') id: string): Promise<Boolean> {
    console.log(` Deleting movie with ID: ${id}`);
    const movie = await this.movieService.deleteOne(Number(id));
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }
}

import { Controller, Get, Post,Param ,Delete,Put, Body,NotFoundException } from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('all')
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
  @Post('update/:title')
  async updateMovieByTitle(
    @Param('title') title: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<Movie> {
    return this.movieService.updateByTitle(title, updateMovieDto);
  }
  
// @Delete(':id')
// async deleteMovieById(@Param('id') id: string): Promise<Boolean> {
//     console.log(` Deleting movie with ID: ${id}`);
//     const movie = await this.movieService.deleteOne(Number(id));
//     if (!movie) {
//       throw new NotFoundException(`Movie with ID ${id} not found`);
//     }
//     return movie;
//   }
  @Delete(':title')
async deleteMovieByTitle(@Param('title') title: string): Promise<boolean> {
  console.log(`Deleting movie with title: ${title}`);
  const deleted = await this.movieService.deleteByTitle(title);
  if (!deleted) {
    throw new NotFoundException(`Movie with title "${title}" not found`);
  }
  return true;
}

}

import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsString({ message: 'Genre must be a string' })
  genre: string;

  @IsNumber({}, { message: 'Duration must be a number' })
  @Min(1, { message: 'Duration must be at least 1 minute' })
  duration: number;

  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(10, { message: 'Rating must be at most 10' })
  rating: number;

  @IsNumber({}, { message: 'Release year must be a number' })
  @Min(1900, { message: 'Release year must be after 1900' })
  @Max(new Date().getFullYear(), { message: 'Release year cannot be in the future' })
  release_year: number;
}

import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class UpdateMovieDto {
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    genre?: string;
  
    @IsOptional()
    @IsNumber()
    duration?: number;
  
    @IsOptional()
    @IsNumber()
    rating?: number;
  
    @IsOptional()
    @IsNumber()
    release_year?: number;
  }
  

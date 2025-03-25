import { IsNumber, IsString, IsDateString,IsOptional, isNumber, Min} from 'class-validator';

export class CreateShowtimeDto {
  @IsNumber()
  movieId: number;

  @IsString()
  theater: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsNumber()
  price: number;
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxSeats?: number;
}

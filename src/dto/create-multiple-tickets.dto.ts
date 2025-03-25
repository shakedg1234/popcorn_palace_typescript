import { IsNumber, Min, Max, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateMultipleTicketsDto {
  @IsNumber()
  showtimeId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  seats: number[];
}

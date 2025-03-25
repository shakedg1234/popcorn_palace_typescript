import { IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @Type(() => Number)
  @IsInt()
  showtimeId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  seatNumber: number;

  @IsUUID()
  userId: string;
}

import { Min,Max,IsNumber } from "class-validator";
export class CreateTicketDto {
    showtimeId: number;
  
    @IsNumber()
    @Min(1)
    @Max(50)
    seat: number;
  }
  
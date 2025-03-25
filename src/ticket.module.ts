import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './models/showtime.entity';
import { Movie } from './models/movie.entity';

import { Ticket } from './models/ticket.entity';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket.service';
@Module({
  imports: [TypeOrmModule.forFeature([Ticket, Showtime, Movie])],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}

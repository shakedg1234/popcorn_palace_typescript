import { Controller, Get, Post,Param ,Delete,Put, Body,NotFoundException } from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { Ticket } from '../models/ticket.entity';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { TicketService } from '../services/ticket.service';
import { CreateMultipleTicketsDto } from '../dto/create-multiple-tickets.dto';
@Controller('bookings')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
async create(@Body() dto: CreateTicketDto): Promise<{ bookingId: string }> {
  return this.ticketService.create(dto);
}

  @Post('Mult')
async bookMultiple(@Body() dto: CreateMultipleTicketsDto): Promise<Ticket[]> {
  return this.ticketService.createMultiple(dto);
}

@Get(':id')
async getOne(@Param('id') id: string): Promise<Ticket> {
  return this.ticketService.findOne(id);
}

@Put(':id')
async update(@Param('id') id: string, @Body() body: { seatNumber: number }): Promise<Ticket> {
  return this.ticketService.update(id, body.seatNumber);
}

@Delete(':id')
async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
  const deleted = await this.ticketService.delete(Number(id));
  if (!deleted) {
    throw new NotFoundException('Ticket not found');
  }
  return { deleted };
}

}


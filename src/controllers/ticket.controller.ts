import { Controller, Get, Post,Param ,Delete,Put, Body,NotFoundException } from '@nestjs/common';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { Ticket } from 'src/models/ticket.entity';
import { CreateTicketDto } from 'src/dto/create-ticket.dto';
import { TicketService } from 'src/services/ticket.service';
import { CreateMultipleTicketsDto } from 'src/dto/create-multiple-tickets.dto';
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async book(@Body() dto: CreateTicketDto): Promise<Ticket> {
    console.log("hi")
    return this.ticketService.create(dto);
  }
  @Post('Mult')
async bookMultiple(@Body() dto: CreateMultipleTicketsDto): Promise<Ticket[]> {
  return this.ticketService.createMultiple(dto);
}

@Get(':id')
async getOne(@Param('id') id: string): Promise<Ticket> {
  return this.ticketService.findOne(Number(id));
}

@Put(':id')
async update(@Param('id') id: string, @Body() body: { seat: number }): Promise<Ticket> {
  return this.ticketService.update(Number(id), body.seat);
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


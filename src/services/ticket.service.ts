import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from '../models/showtime.entity';
import { Movie } from '../models/movie.entity';
import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import { promises } from 'dns';
import { Ticket } from '../models/ticket.entity';
import { CreateTicketDto } from 'src/dto/create-ticket.dto';
import { CreateMultipleTicketsDto } from 'src/dto/create-multiple-tickets.dto';
@Injectable()
export class TicketService{
    constructor(
        @InjectRepository(Showtime)
        private readonly showtimeRepository: Repository<Showtime>,
    
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
      ) {}
      async create(dto: CreateTicketDto): Promise<Ticket> {
        const showtime = await this.showtimeRepository.findOne({
          where: { id: dto.showtimeId },
          relations: ['tickets'], // to get booked tickets
        });
      
        if (!showtime) {
          throw new NotFoundException('Showtime not found');
        }
      
        const bookedSeats = await this.ticketRepository.count({
          where: { showtime: { id: dto.showtimeId } },
        });
      
        if (bookedSeats >= showtime.maxSeats) {
          throw new BadRequestException('No more seats available for this showtime');
        }
      
        const existingTicket = await this.ticketRepository.findOne({
          where: {
            showtime: { id: dto.showtimeId },
            seat: dto.seat,
          },
        });
      
        if (existingTicket) {
          throw new BadRequestException('Seat already booked for this showtime');
        }
      
        const ticket = this.ticketRepository.create({
          showtime,
          seat: dto.seat,
        });
      
        return this.ticketRepository.save(ticket);
      }
      async createMultiple(dto: CreateMultipleTicketsDto): Promise<Ticket[]> {
        const { showtimeId, seats } = dto;
      
        const showtime = await this.showtimeRepository.findOne({ where: { id: showtimeId } });
        if (!showtime) {
          throw new NotFoundException('Showtime not found');
        }
      
        const bookedSeats = await this.ticketRepository.find({
          where: {
            showtime: { id: showtimeId },
          },
        });
        const alreadyBooked = bookedSeats.map((t) => t.seat);
      
        const conflicting = seats.filter((seat) => alreadyBooked.includes(seat));
        if (conflicting.length > 0) {
          throw new BadRequestException(`Seats already booked: ${conflicting.join(', ')}`);
        }
      
        if (bookedSeats.length + seats.length > 50) {
          throw new BadRequestException('Not enough available seats');
        }
      
        const tickets = seats.map((seat) =>
          this.ticketRepository.create({ seat, showtime }),
        );
      
        return this.ticketRepository.save(tickets);
      }
      
      async findOne(id: number): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({
          where: { id },
          relations: ['showtime'],
        });
        if (!ticket) {
          throw new NotFoundException('Ticket not found');
        }
        return ticket;
      }
      
      async update(id: number, seat: number): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({ where: { id } });
        if (!ticket) {
          throw new NotFoundException('Ticket not found');
        }
      
        const exists = await this.ticketRepository.findOne({
          where: {
            showtime: { id: ticket.showtime.id },
            seat,
          },
        });
      
        if (exists) {
          throw new BadRequestException('Seat already booked for this showtime');
        }
      
        ticket.seat = seat;
        return this.ticketRepository.save(ticket);
      }
      
      async delete(id: number): Promise<boolean> {
        const result = await this.ticketRepository.delete(id);
        return result.affected > 0;
      }
      
}
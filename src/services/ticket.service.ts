import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Showtime } from '../models/showtime.entity';
  import { Movie } from '../models/movie.entity';
  import { Ticket } from '../models/ticket.entity';
  import { CreateTicketDto } from 'src/dto/create-ticket.dto';
  import { CreateMultipleTicketsDto } from 'src/dto/create-multiple-tickets.dto';
  
  @Injectable()
  export class TicketService {
    constructor(
      @InjectRepository(Showtime)
      private readonly showtimeRepository: Repository<Showtime>,
  
      @InjectRepository(Movie)
      private readonly movieRepository: Repository<Movie>,
  
      @InjectRepository(Ticket)
      private readonly ticketRepository: Repository<Ticket>,
    ) {}
  
    async create(dto: CreateTicketDto): Promise<{ bookingId: string }> {
      const showtime = await this.showtimeRepository.findOne({
        where: { id: dto.showtimeId },
        relations: ['tickets'],
      });
  
      if (!showtime) {
        throw new NotFoundException('Showtime not found');
      }
  
      const bookedSeats = await this.ticketRepository.count({
        where: { showtime: { id: dto.showtimeId } },
      });
  
      if (bookedSeats >= showtime.maxSeats) {
        throw new BadRequestException(
          'No more seats available for this showtime',
        );
      }
  
      const existingTicket = await this.ticketRepository.findOne({
        where: {
          showtime: { id: dto.showtimeId },
          seatNumber: dto.seatNumber,
        },
      });
  
      if (existingTicket) {
        throw new BadRequestException(
          'Seat already booked for this showtime',
        );
      }
  
      const ticket = this.ticketRepository.create({
        showtime,
        seatNumber: dto.seatNumber,
        userId: dto.userId,
      });
  
      const saved = await this.ticketRepository.save(ticket);
      return { bookingId: saved.id };
    }
  
    async createMultiple(dto: CreateMultipleTicketsDto): Promise<Ticket[]> {
      const { showtimeId, seats } = dto;
  
      const showtime = await this.showtimeRepository.findOne({
        where: { id: showtimeId },
      });
  
      if (!showtime) {
        throw new NotFoundException('Showtime not found');
      }
  
      const bookedSeats = await this.ticketRepository.find({
        where: {
          showtime: { id: showtimeId },
        },
      });
  
      const alreadyBooked = bookedSeats.map((t) => t.seatNumber);
      const conflicting = seats.filter((seat) =>
        alreadyBooked.includes(seat),
      );
  
      if (conflicting.length > 0) {
        throw new BadRequestException(
          `Seats already booked: ${conflicting.join(', ')}`,
        );
      }
  
      if (bookedSeats.length + seats.length > showtime.maxSeats) {
        throw new BadRequestException('Not enough available seats');
      }
  
      const tickets = seats.map((seatNumber) =>
        this.ticketRepository.create({ seatNumber, showtime }),
      );
  
      return this.ticketRepository.save(tickets);
    }
  
    async findOne(id: string): Promise<Ticket> {
      const ticket = await this.ticketRepository.findOne({
        where: { id },
        relations: ['showtime'],
      });
      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }
      return ticket;
    }
  
    async update(id: string, seatNumber: number): Promise<Ticket> {
      const ticket = await this.ticketRepository.findOne({
        where: { id },
        relations: ['showtime'],
      });
  
      if (!ticket) {
        throw new NotFoundException('Ticket not found');
      }
  
      const exists = await this.ticketRepository.findOne({
        where: {
          showtime: { id: ticket.showtime.id },
          seatNumber,
        },
      });
  
      if (exists) {
        throw new BadRequestException(
          'Seat already booked for this showtime',
        );
      }
  
      ticket.seatNumber = seatNumber;
      return this.ticketRepository.save(ticket);
    }
  
    async delete(id: number): Promise<boolean> {
      const result = await this.ticketRepository.delete(id);
      return result.affected > 0;
    }
  }
  
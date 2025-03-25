import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { Showtime } from '../models/showtime.entity';
import { Ticket } from '../models/ticket.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Movie } from '../models/movie.entity';

describe('TicketService', () => {
  let service: TicketService;
  let ticketRepo: jest.Mocked<Repository<Ticket>>;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Showtime),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    ticketRepo = module.get(getRepositoryToken(Ticket));
    showtimeRepo = module.get(getRepositoryToken(Showtime));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should book a ticket if seat is available and under max seats', async () => {
    const showtimeMock = { id: 1, maxSeats: 50 };
    const dto: CreateTicketDto = {
      showtimeId: 1,
      seatNumber: 10,
      userId: '84438967-f68f-4fa0-b620-0f08217e76af',
    };

    showtimeRepo.findOne.mockResolvedValue(showtimeMock as Showtime);
    ticketRepo.count.mockResolvedValue(10);
    ticketRepo.findOne.mockResolvedValue(null);
    ticketRepo.create.mockReturnValue({
        seatNumber: dto.seatNumber,
      userId: dto.userId,
      showtime: showtimeMock,
    } as Ticket);

    ticketRepo.save.mockResolvedValue({
      id: 'mock-booking-id',
      seatNumber: dto.seatNumber,
      userId: dto.userId,
      showtime: showtimeMock,
    } as Ticket);

    const result = await service.create(dto);
    expect(result).toEqual({ bookingId: 'mock-booking-id' });
    expect(ticketRepo.save).toHaveBeenCalled();
  });

  it('should throw if showtime is not found', async () => {
    showtimeRepo.findOne.mockResolvedValue(null);
    await expect(
      service.create({
        showtimeId: 1,
        seatNumber: 10,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if seat already booked', async () => {
    showtimeRepo.findOne.mockResolvedValue({ id: 1, maxSeats: 50 } as Showtime);
    ticketRepo.count.mockResolvedValue(10);
    ticketRepo.findOne.mockResolvedValue({ id: 'existing-ticket-id' } as Ticket);

    await expect(
      service.create({
        showtimeId: 1,
        seatNumber: 10,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw if max seats exceeded', async () => {
    showtimeRepo.findOne.mockResolvedValue({ id: 1, maxSeats: 50 } as Showtime);
    ticketRepo.count.mockResolvedValue(50);
    ticketRepo.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        showtimeId: 1,
        seatNumber: 51,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});

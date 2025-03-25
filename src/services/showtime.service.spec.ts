import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimeService } from './showtime.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Showtime } from '../models/showtime.entity';
import { Movie } from '../models/movie.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ShowtimeService', () => {
  let service: ShowtimeService;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;
  let movieRepo: jest.Mocked<Repository<Movie>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimeService,
        {
          provide: getRepositoryToken(Showtime),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            }),
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

    service = module.get<ShowtimeService>(ShowtimeService);
    showtimeRepo = module.get(getRepositoryToken(Showtime));
    movieRepo = module.get(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a showtime if no overlap and movie exists', async () => {
    const dto = {
      movieId: 1,
      theater: 'אולם 1',
      start_time: '2025-03-25T18:00:00Z',
      end_time: '2025-03-25T20:00:00Z',
      price: 35,
    };

    const movie = { id: 1 } as Movie;
    const showtime =  { id: 1, maxSeats: 50 } as Showtime;

    movieRepo.findOne.mockResolvedValue(movie);
    (showtimeRepo.createQueryBuilder as any)().getOne.mockResolvedValue(null);
    showtimeRepo.create.mockReturnValue(showtime);
    showtimeRepo.save.mockResolvedValue(showtime);

    const result = await service.create(dto);
    expect(result).toEqual(showtime);
  });

  it('should throw if movie not found', async () => {
    movieRepo.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        movieId: 99,
        theater: 'אולם 1',
        start_time: '2025-03-25T18:00:00Z',
        end_time: '2025-03-25T20:00:00Z',
        price: 35,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw if showtime overlaps in same theater', async () => {
    const dto = {
      movieId: 1,
      theater: 'אולם 1',
      start_time: '2025-03-25T18:00:00Z',
      end_time: '2025-03-25T20:00:00Z',
      price: 35,
    };

    movieRepo.findOne.mockResolvedValue({ id: 1 } as Movie);
    (showtimeRepo.createQueryBuilder as any)().getOne.mockResolvedValue({ id: 99 });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });
});

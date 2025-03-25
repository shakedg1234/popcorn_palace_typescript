import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../models/movie.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('MovieService', () => {
  let service: MovieService;
  let repo: jest.Mocked<Repository<Movie>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    repo = module.get(getRepositoryToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a new movie', async () => {
    const movieData = {
      title: 'Wonder Woman 1984',
      genre: 'Action',
      duration: 148,
      rating: 8.8,
      release_year: 2020,
    };
  
    const savedMovie = { id: 1, ...movieData };
  
    repo.create.mockReturnValue(movieData as Movie);
    repo.save.mockResolvedValue(savedMovie as Movie);
  
    const result = await service.create(movieData as Movie);
    expect(result).toEqual(savedMovie);
    expect(repo.save).toHaveBeenCalledWith(movieData);
  });
  
});


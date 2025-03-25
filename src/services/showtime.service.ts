import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Showtime } from '../models/showtime.entity';
import { Movie } from '../models/movie.entity';
import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import { promises } from 'dns';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createDto: CreateShowtimeDto): Promise<Showtime> {
    const movie = await this.movieRepository.findOne({ where: { id: createDto.movieId } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${createDto.movieId} not found`);
    }
  
    const overlapping = await this.showtimeRepository
      .createQueryBuilder('showtime')
      .where('showtime.theater = :theater', { theater: createDto.theater })
      .andWhere('showtime.startTime < :endTime', { endTime: createDto.endTime })
      .andWhere('showtime.endTime > :startTime', { startTime: createDto.startTime })
      .getOne();
  
    if (overlapping) {
      throw new BadRequestException('There is an overlapping showtime in this theater.');
    }
  
    const showtime = this.showtimeRepository.create({
      movie,
      theater: createDto.theater,
      startTime: new Date(createDto.startTime),
      endTime: new Date(createDto.endTime),
      price: createDto.price,
    });
  
    return this.showtimeRepository.save(showtime);
  }
  
  async getAllShowtimes() : Promise<Showtime[]>{
    return this.showtimeRepository.find({

      });  
    }
    async update(id: number, dto: CreateShowtimeDto): Promise<Showtime> {
        const showtime = await this.showtimeRepository.findOne({ where: { id }, relations: ['movie'] });
        if (!showtime) throw new NotFoundException('Showtime not found');
      
        const movie = await this.movieRepository.findOne({ where: { id: dto.movieId } });
        if (!movie) throw new NotFoundException('Movie not found');
      
        const overlapping = await this.showtimeRepository
          .createQueryBuilder('s')
          .where('s.theater = :theater', { theater: dto.theater })
          .andWhere('s.startTime< :endTime', { endTime: dto.endTime })
          .andWhere('s.endTime > :startTime', { startTime: dto.startTime })
          .andWhere('s.id != :id', { id }) // לא לבדוק מול ההקרנה שאנחנו מעדכנים
          .getOne();
      
        if (overlapping) {
          throw new BadRequestException('Overlapping showtime exists');
        }
      
        Object.assign(showtime, {
          movie,
          theater: dto.theater,
          startTime: new Date(dto.startTime),
          endTime: new Date(dto.endTime),
          price: dto.price,
        });
      
        return this.showtimeRepository.save(showtime);
      }
      async delete(id: number): Promise<boolean> {
        const result = await this.showtimeRepository.delete(id);
        return result.affected > 0;
      }
      async findOne(id: number): Promise<Showtime | null> {
        return this.showtimeRepository.findOne({
          where: { id },
          relations: ['movie'],
        });
      }
      
      

}

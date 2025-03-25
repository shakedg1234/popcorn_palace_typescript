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
      .andWhere('showtime.start_time < :end_time', { end_time: createDto.end_time })
      .andWhere('showtime.end_time > :start_time', { start_time: createDto.start_time })
      .getOne();
  
    if (overlapping) {
      throw new BadRequestException('There is an overlapping showtime in this theater.');
    }
  
    const showtime = this.showtimeRepository.create({
      movie,
      theater: createDto.theater,
      start_time: new Date(createDto.start_time),
      end_time: new Date(createDto.end_time),
      price: createDto.price,
    });
  
    return this.showtimeRepository.save(showtime);
  }
  
  async getAllShowtimes() : Promise<Showtime[]>{
    return this.showtimeRepository.find({
        relations: ['movie'], 
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
          .andWhere('s.start_time < :end_time', { end_time: dto.end_time })
          .andWhere('s.end_time > :start_time', { start_time: dto.start_time })
          .andWhere('s.id != :id', { id }) // לא לבדוק מול ההקרנה שאנחנו מעדכנים
          .getOne();
      
        if (overlapping) {
          throw new BadRequestException('Overlapping showtime exists');
        }
      
        Object.assign(showtime, {
          movie,
          theater: dto.theater,
          start_time: new Date(dto.start_time),
          end_time: new Date(dto.end_time),
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

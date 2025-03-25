import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './models/showtime.entity';
import { Movie } from './models/movie.entity';
import { ShowtimeService } from './services/showtime.service';
import { ShowtimeController } from './controllers/showtime.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Movie])],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
})
export class ShowtimeModule {}

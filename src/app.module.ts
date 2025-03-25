import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './movie.module';
import { Movie } from './models/movie.entity';
import { Showtime } from './models/showtime.entity';
import { ShowtimeModule } from './showtime.module';
import { Ticket } from './models/ticket.entity';
import { TicketModule } from './ticket.module';

@Module({
  imports: [
   

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      entities: [Movie, Showtime, Ticket],
      autoLoadEntities: true,
      synchronize: true,
    }),
    
    MovieModule,
    ShowtimeModule,
    TicketModule


  ],
})
export class AppModule {}

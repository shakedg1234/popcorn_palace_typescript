import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToMany } from 'typeorm';
import { Movie } from './movie.entity';
import { Ticket } from './ticket.entity';

@Entity()
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  movie: Movie;

  @Column()
  theater: string;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column('float')
  price: number;
  @OneToMany(() => Ticket, (ticket) => ticket.showtime)
  tickets: Ticket[];
  
@Column({ default: 50 })
maxSeats: number;
}

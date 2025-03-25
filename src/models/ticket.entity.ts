import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Showtime } from './showtime.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  seatNumber: number;

  @ManyToOne(() => Showtime, (showtime) => showtime.tickets, {
    onDelete: 'CASCADE',
  })
  showtime: Showtime;
}

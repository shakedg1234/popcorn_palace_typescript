import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Showtime } from './showtime.entity';

@Entity()
@Unique(['showtime', 'seat']) // 👈 לא לאפשר הזמנה כפולה לאותו מושב באותה הקרנה
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Showtime, (showtime) => showtime.tickets)
  showtime: Showtime;

  @Column()
seat: number;
}

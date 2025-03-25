import { Controller, Get, Post,Param ,Delete,Put, Body,NotFoundException } from '@nestjs/common';
import { ShowtimeService } from '../services/showtime.service';
import { CreateShowtimeDto } from '../dto/create-showtime.dto';
import { Showtime } from '../models/showtime.entity';

@Controller('showtimes')
export class ShowtimeController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @Get()
  async getAllShowtimes(): Promise<Showtime[]>{
    return this.showtimeService.getAllShowtimes();
  }

  @Post()
  async createShowtime(@Body() dto: CreateShowtimeDto): Promise<Showtime> {
    return this.showtimeService.create(dto);
  }
  @Post('update/:id')
async updateShowtime(
  @Param('id') id: string,
  @Body() dto: CreateShowtimeDto,
): Promise<Showtime> {
  return this.showtimeService.update(Number(id), dto);
}

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.showtimeService.delete(Number(id));
    return { deleted };
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Showtime> {
    return this.showtimeService.findOne(Number(id));
  }
}

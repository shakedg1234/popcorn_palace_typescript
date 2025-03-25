// test/ticket.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TicketController (e2e)', () => {
  let app: INestApplication;
  let showtimeId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    // 🎬 יצירת סרט
    const movieResponse = await request(app.getHttpServer())
      .post('/movies')
      .send({
        title: 'The Matrix E2E5',
        genre: 'Sci-Fi',
        duration: 136,
        rating: 9,
        release_year: 1999,
      });
    expect(movieResponse.status).toBe(201);
expect(movieResponse.body).toHaveProperty('id');

console.log(movieResponse.body)
    const movieId = movieResponse.body.id;

    // 🎥 יצירת Showtime עבור הסרט
    const showtimeResponse = await request(app.getHttpServer())
      .post('/showtimes')
      .send({
        movieId,
        theater: 'E2E Hall',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        price: 42.5,
      });
      expect(showtimeResponse.status).toBe(201);
expect(showtimeResponse.body).toHaveProperty('id');

    showtimeId = showtimeResponse.body.id;
    // console.log(showtimeResponse)
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a ticket (POST /bookings)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send({
        showtimeId: Number(showtimeId),
        seatNumber: 15,
        userId: '84438967-f68f-4fa0-b620-0f08217e76af',
      });
      

      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('bookingId');
  });

  it('should fail if seat already taken', async () => {
    await request(app.getHttpServer())
      .post('/bookings')
      .send({
        showtimeId: Number(showtimeId),
        seatNumber: 15,
        userId: '00000000-0000-0000-0000-000000000002',
      });

    const response = await request(app.getHttpServer())
      .post('/bookings')
      .send({
        showtimeId: Number(showtimeId),
        seatNumber: 15,
        userId: '00000000-0000-0000-0000-000000000003',
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Seat already booked');
  });
});

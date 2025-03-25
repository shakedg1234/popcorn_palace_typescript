# 🎬 Popcorn Palace – Backend Instructions

Welcome to the Popcorn Palace Backend Project!

This document explains how to install, run, build, and test the project locally.

---

## 🛠️ Prerequisites

- Node.js (version 18+ recommended)
- npm (comes with Node.js)
- Docker (for running the PostgreSQL database)

---

## 🚀 Getting Started

### 1. Clone the Repository


git clone <your-repo-url>
cd popcorn_palace_typescript
2. Install Dependencies
bash
Copy
Edit
npm install
🐘 Database Setup (PostgreSQL)
The project uses PostgreSQL, and you can run it locally using Docker Compose.

Run PostgreSQL with Docker:
bash
Copy
Edit
docker-compose up -d
The database will run on port 5432 with the following credentials:

User: popcorn-palace

Password: popcorn-palace

Database name: popcorn-palace

The connection is already configured in app.module.ts using TypeOrmModule.forRoot(...).

🏗️ Build the Project
bash
Copy
Edit
npm run build
🧪 Run Tests
Unit Tests:
bash
Copy
Edit
npm run test
End-to-End (E2E) Tests:
bash
Copy
Edit
npm run test:e2e
Make sure the database is running before running E2E tests.

📬 API Endpoints
The API exposes the following endpoints:

Movies:

GET /movies – Get all movies

POST /movies – Add a new movie

POST /movies/update/:title – Update a movie by title

DELETE /movies/:title – Delete a movie by title

Showtimes:

GET /showtimes – Get all showtimes

POST /showtimes – Add a showtime

POST /showtimes/update/:id – Update a showtime

DELETE /showtimes/:id – Delete a showtime

Tickets (Bookings):

POST /bookings – Book a single ticket

POST /bookings/multiple – Book multiple tickets

GET /tickets/:id – Get ticket info

PUT /tickets/:id – Update ticket seat

DELETE /tickets/:id – Cancel a booking

All endpoints use JSON format.

✅ Notes
Validation and error handling are implemented using class-validator.

The system ensures:

No overlapping showtimes in the same theater

No double-booking of seats

A limit of 50 seats per showtime (default)

Proper error messages and HTTP status codes are returned on failure.

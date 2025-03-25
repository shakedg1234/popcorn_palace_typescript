# 🎬 Popcorn Palace – Backend Instructions

Welcome to the Popcorn Palace Backend Project!<br>

This document explains how to install, run, build, and test the project locally.<br>

---

## 🛠️ Prerequisites</br>

- Node.js (version 18+ recommended)<br>
- npm (comes with Node.js)<br>
- Docker (for running the PostgreSQL database)</br>

---

## 🚀 Getting Started

### 1. Clone the Repository


-git clone https://github.com/shakedg1234/popcorn_palace_typescript.git<br>

###2. Install Dependencies<br>

npm install<br>
🐘 Database Setup (PostgreSQL)<br>
The project uses PostgreSQL, and you can run it locally using Docker Compose.<br>

Run PostgreSQL with Docker:<br>
-docker-compose up -d<br>

The database will run on port 5432 with the following credentials:<br>

User: popcorn-palace<br>

Password: popcorn-palace<br>

Database name: popcorn-palace<br>

The connection is already configured in app.module.ts using TypeOrmModule.forRoot(...).<br>

###🏗️ Build the Project<br>

npm run build<br>
<br>
🧪 Run Tests<br>
Unit Tests:<br>
-npm run test<br>
End-to-End (E2E) Tests:<br>
-npm run test:e2e<br>
Make sure the database is running before running E2E tests.<br>

📬 API Endpoints<br>
The API exposes the following endpoints:<br>

Movies:<br>

GET /movies/all – Get all movies<br>

POST /movies – Add a new movie<br>

POST /movies/update/:title – Update a movie by title<br>

DELETE /movies/:title – Delete a movie by title<br>

Showtimes:<br>

GET /showtimes – Get all showtimes<br>

POST /showtimes – Add a showtime<br>

POST /showtimes/update/:id – Update a showtime<br>

DELETE /showtimes/:id – Delete a showtime<br>

Tickets (Bookings):<br>

POST /bookings – Book a single ticket<br>

POST /bookings/multiple – Book multiple tickets<br>

GET /tickets/:id – Get ticket info<br>

PUT /tickets/:id – Update ticket seat<br>

DELETE /tickets/:id – Cancel a booking<br>

All endpoints use JSON format.<br>

✅ Notes<br>
Validation and error handling are implemented using class-validator.<br>

The system ensures:<br>

No overlapping showtimes in the same theater<br>

No double-booking of seats<br>

A limit of 50 seats per showtime (default)<br>

Proper error messages and HTTP status codes are returned on failure.<br>

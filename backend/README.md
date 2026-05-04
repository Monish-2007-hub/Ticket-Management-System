# Integrated Ticket and Bus Pass Management System - Backend

This is the backend API for the project, built with Node.js, Express, and MySQL.

## Prerequisites

- Node.js installed
- MySQL Server running

## Setup

1.  **Database Configuration**:
    - Ensure your MySQL database is running and matches the schema described in the project context.
    - Create a `.env` file in the `backend` directory (you can use `.env.example` as a template).
    - Update the `.env` file with your database credentials and a `JWT_SECRET`.

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Seed Initial Admin (Optional)**:
    If your `USERS` table is empty, run this to create an `admin` account:
    ```bash
    npm run seed
    ```
    Default login: `admin` / `admin`.

4.  **Start the Server**:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:5000` by default.

## API Endpoints

### Auth
- `POST /api/auth/login` - Login to the system

### Passengers
- `GET /api/passengers` - Get all passengers
- `POST /api/passengers` - Add a passenger
- `PUT /api/passengers/:id` - Update a passenger
- `DELETE /api/passengers/:id` - Delete a passenger

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Book a ticket (updates seat status)

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Add a route

### Bus & Seats
- `GET /api/bus` - Get all buses
- `GET /api/seats/:bus_id` - Get seats for a specific bus
- `PUT /api/seats/book` - Manually mark a seat as booked

### Bus Pass
- `GET /api/pass` - Get all bus passes
- `POST /api/pass` - Issue a new bus pass

### Dashboard
- `GET /api/dashboard` - Get summary statistics for the dashboard

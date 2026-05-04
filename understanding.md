# Integrated Ticket and Bus Pass Management System

## Overview
The Integrated Ticket and Bus Pass Management System is a comprehensive web-based application designed to manage public transportation operations. It provides a centralized dashboard for administrators to oversee passengers, tickets, bus routes, fleet status, and monthly passes.

---

## Tech Stack
- **Frontend Framework**: React.js (Functional Components with Hooks)
- **Build Tool**: Vite (for fast, optimized development)
- **Styling**: Tailwind CSS (Utility-first CSS framework for rapid, responsive UI development)
- **Routing**: React Router DOM (Client-side routing for seamless navigation)
- **State Management**: React State (`useState`, `useEffect`)
- **API Simulation**: LocalStorage & Axios Mocking (To demonstrate database operations without a live backend)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## Architecture
The application follows a standard **Single Page Application (SPA)** architecture:

1.  **UI Components Layer (`src/components`)**: Reusable presentation components like layouts, headers, and sidebars.
2.  **Pages Layer (`src/pages`)**: The main views corresponding to different routes (Dashboard, Passengers, Tickets, etc.).
3.  **Services Layer (`src/services`)**: Contains the API communication logic (`api.js`). In this iteration, it intercepts what would be standard API calls and resolves them using browser `localStorage`. This creates a fully functional client-side prototype.
4.  **Routing Layer (`src/routes.jsx`)**: Defines public (`/login`) and protected (`/dashboard`, `/passengers`, etc.) routes, utilizing an authentication wrapper.

---

## Workflow & User Journey

1.  **Authentication**: The user (Admin) arrives at the login page. They must enter valid credentials (mocked as `admin` / `admin`). Upon success, a session token is stored.
2.  **Dashboard Access**: The user is redirected to the Dashboard. The application queries the `dashboardService` to fetch summary metrics (Total Passengers, Tickets, Active Routes, Active Passes).
3.  **Entity Management**:
    *   **Passengers**: Admin can view the list of registered passengers, add new ones via a modal form, edit, or delete them.
    *   **Tickets**: Admin can book new tickets. This requires selecting an existing passenger and an existing route.
    *   **Routes**: Admin can define new routes by setting a start and end point.
    *   **Bus Fleet**: Admin can view all active buses. Selecting a bus reveals its interactive seating layout, simulating available and booked seats dynamically.
    *   **Bus Passes**: Admin can issue long-term passes for passengers, setting issue and expiry dates. The system visually flags passes that are expired or expiring soon.

---

## Mock Database Schema (LocalStorage)

To visualize database operations, the application stores data in `localStorage` under the following keys (acting as tables):

### 1. `passengers`
Stores demographic data about the users of the transport system.
*   `passenger_id` (String) - Primary Key
*   `first_name` (String)
*   `last_name` (String)
*   `date_of_birth` (Date String)
*   `passenger_type` (Enum: Regular, Student, Senior)

### 2. `tickets`
Records individual journeys booked by passengers.
*   `ticket_id` (String) - Primary Key
*   `passenger_id` (String) - Foreign Key to `passengers`
*   `route_id` (String) - Foreign Key to `routes`
*   `travel_date` (Date String)
*   `fare` (Number)

### 3. `routes`
Defines the physical paths the buses travel.
*   `route_id` (String) - Primary Key
*   `route_name` (String)
*   `start_point` (String)
*   `end_point` (String)

### 4. `buses`
Represents the physical fleet.
*   `bus_id` (String) - Primary Key
*   `route_id` (String) - Foreign Key to `routes`
*   `capacity` (Number)
*   `status` (String)

### 5. `passes`
Manages long-term travel subscriptions.
*   `pass_id` (String) - Primary Key
*   `passenger_id` (String) - Foreign Key to `passengers`
*   `issue_date` (Date String)
*   `expiry_date` (Date String)

---

## Future Enhancements
*   Swap out the `localStorage` mocked `services/api.js` functions with real Axios calls to a REST API.
*   Implement JWT-based authentication with a real backend.
*   Add dynamic charting libraries (like Recharts) to the Dashboard for visual analytics.

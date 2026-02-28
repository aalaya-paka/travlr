# Travlr Getaways

A full-stack MEAN (MongoDB, Express, Angular, Node.js) travel booking application. The project consists of three layers: a customer-facing server-rendered website, a RESTful API, and an Angular single-page admin panel.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup and Seeding](#database-setup-and-seeding)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Customer-Facing Website](#customer-facing-website)
- [Admin SPA (Angular)](#admin-spa-angular)
- [Data Models](#data-models)
- [Technologies Used](#technologies-used)

---

## Architecture Overview

```
+---------------------+       +---------------------+       +------------+
|  Customer Website   | ----> |    REST API          | ----> |  MongoDB   |
|  (Express + HBS)    |       |    (Express)         |       |  (travlr)  |
|  Port 3000          |       |    Port 3000 /api    |       +------------+
+---------------------+       +---------------------+
                                       ^
                                       |
                              +---------------------+
                              |   Admin SPA          |
                              |   (Angular 19)       |
                              |   Port 4200          |
                              +---------------------+
```

| Layer | Technology | Description |
|---|---|---|
| Customer Website | Express.js + Handlebars | Server-rendered pages for browsing trips |
| REST API | Express.js + Mongoose | JSON API for CRUD operations on trips and user authentication |
| Admin Panel | Angular 19 | Single-page application for managing trips (add, edit, list) |
| Database | MongoDB + Mongoose | Stores trips and user data |
| Authentication | Passport.js + JWT | Local strategy (email/password) with JSON Web Token authorization |

---

## Project Structure

```
travlr/
├── app.js                          # Express app entry point (middleware, routes)
├── bin/www                         # HTTP server startup (port 3000)
├── package.json                    # Root dependencies and scripts
├── .env                            # Environment variables (JWT_SECRET, DB_HOST)
├── data/trips.json                 # Seed data for trips collection
│
├── app_api/                        # REST API layer
│   ├── config/
│   │   └── passport.js             # Passport LocalStrategy configuration
│   ├── controllers/
│   │   ├── authentication.js       # Register and login handlers
│   │   └── trips.js                # CRUD handlers for trips
│   ├── models/
│   │   ├── db.js                   # MongoDB connection manager
│   │   ├── travlr.js               # Trip Mongoose schema
│   │   ├── user.js                 # User Mongoose schema (with JWT generation)
│   │   └── seed.js                 # Database seeding script
│   └── routes/
│       └── index.js                # API route definitions + JWT middleware
│
├── app_server/                     # Customer-facing server-rendered site
│   ├── controllers/
│   │   ├── main.js                 # Home page controller
│   │   └── travel.js               # Travel listing and detail controllers
│   ├── routes/
│   │   ├── index.js                # GET /
│   │   ├── travel.js               # GET /travel, GET /travel/:tripCode
│   │   └── users.js                # GET /users (placeholder)
│   └── views/
│       ├── layouts/layout.hbs      # Master HTML layout
│       ├── partials/
│       │   ├── header.hbs          # Navigation header with logo
│       │   └── footer.hbs          # Footer with links and copyright
│       ├── index.hbs               # Home page template
│       ├── travel.hbs              # Trip listing template
│       ├── travel-detail.hbs       # Single trip detail template
│       └── error.hbs               # Error page template
│
├── app_admin/                      # Angular 19 admin SPA
│   ├── package.json                # Angular dependencies
│   ├── angular.json                # Angular CLI build configuration
│   └── src/
│       ├── main.ts                 # Angular bootstrap entry
│       ├── index.html              # HTML shell (Bootstrap 5.3.2 CDN)
│       └── app/
│           ├── app.config.ts       # Providers (router, HTTP, JWT interceptor)
│           ├── app.routes.ts       # Angular routes
│           ├── app.component.ts    # Root component (navbar + router-outlet)
│           ├── storage.ts          # localStorage injection token
│           ├── models/             # Trip, User, AuthResponse interfaces
│           ├── services/
│           │   ├── trip-data.service.ts        # HTTP calls to REST API
│           │   └── authentication.service.ts   # Token management, login/logout
│           ├── utils/
│           │   └── jwt.interceptor.ts          # Attaches Bearer token to requests
│           ├── navbar/             # Navigation bar component
│           ├── trip-listing/       # Trip list view component
│           ├── trip-card/          # Individual trip card component
│           ├── add-trip/           # Add new trip form component
│           ├── edit-trip/          # Edit existing trip form component
│           └── login/              # Login form component
│
└── public/                         # Static assets served by Express
    ├── images/                     # All images (logo, reef photos, backgrounds)
    ├── css/style.css               # Main stylesheet
    └── stylesheets/style.css       # Additional stylesheet
```

---

## Prerequisites

Ensure the following are installed on your system:

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- **MongoDB** (v6 or later, running locally or accessible remotely)
- **Angular CLI** (for the admin panel)

```bash
# Install Angular CLI globally (if not already installed)
npm install -g @angular/cli
```

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd travlr
```

### 2. Install server dependencies

```bash
npm install
```

### 3. Install Angular admin dependencies

```bash
cd app_admin
npm install
cd ..
```

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
JWT_SECRET=your_secret_key_here
DB_HOST=127.0.0.1
PORT=3000
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `JWT_SECRET` | Yes | None | Secret key used to sign and verify JSON Web Tokens |
| `DB_HOST` | No | `127.0.0.1` | MongoDB host address |
| `PORT` | No | `3000` | Port for the Express server |

---

## Database Setup and Seeding

### 1. Start MongoDB

Make sure MongoDB is running locally:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Or start manually
mongod --dbpath /path/to/your/data/directory
```

### 2. Seed the database

The seed script clears existing trip data and imports 3 sample trips from `data/trips.json`:

```bash
npm run seed
```

This populates the `travlr` database with the following trips:

| Trip Code | Name | Resort | Price/Person |
|---|---|---|---|
| GALR210124 | Gale Reef | Emerald Bay, 3 stars | $799 |
| DAWR210315 | Dawson's Reef | Blue Lagoon, 4 stars | $1,199 |
| CLAR210621 | Claire's Reef | Coral Sands, 5 stars | $1,999 |

---

## Running the Application

### Start the Express server (customer site + API)

```bash
npm start
```

The server starts on **http://localhost:3000**.

### Start the Angular admin panel (separate terminal)

```bash
cd app_admin
ng serve
```

The admin panel runs on **http://localhost:4200**.

### Access points

| URL | Description |
|---|---|
| http://localhost:3000 | Customer home page |
| http://localhost:3000/travel | Trip listing page |
| http://localhost:3000/travel/:tripCode | Individual trip detail page |
| http://localhost:3000/api/trips | REST API - all trips (JSON) |
| http://localhost:4200 | Angular admin panel |

---

## API Reference

Base URL: `http://localhost:3000/api`

### Trips

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/trips` | No | List all trips |
| `GET` | `/api/trips/:tripCode` | No | Get a single trip by its code |
| `POST` | `/api/trips` | Yes (JWT) | Create a new trip |
| `PUT` | `/api/trips/:tripCode` | Yes (JWT) | Update an existing trip |

#### Trip request/response body

```json
{
  "code": "GALR210124",
  "name": "Gale Reef",
  "length": "4 nights / 5 days",
  "start": "2021-02-14T08:00:00Z",
  "resort": "Emerald Bay, 3 stars",
  "perPerson": "799",
  "image": "reef1.jpg",
  "description": "<p>Trip description with HTML support.</p>"
}
```

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/register` | No | Register a new user |
| `POST` | `/api/login` | No | Login and receive a JWT |

#### Register request body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Login request body

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

#### Auth response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Authentication

The application uses a two-layer authentication system:

### Passport.js (Local Strategy)

- Users authenticate with **email and password**
- Passwords are hashed using `crypto.pbkdf2Sync` (1000 iterations, 64-byte key, SHA-512) with a random 16-byte salt
- The `passport-local` strategy is configured with `usernameField: 'email'`

### JSON Web Tokens (JWT)

- On successful login or registration, the server returns a signed JWT
- The token contains: `_id`, `email`, `name`
- Token expiry: **1 hour**
- Protected API routes (`POST /api/trips`, `PUT /api/trips/:tripCode`) require the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Angular JWT Interceptor

The admin panel automatically attaches the JWT to outgoing HTTP requests via an Angular `HttpInterceptor` when the user is logged in. Tokens are stored in `localStorage` under the key `travlr-token`.

---

## Customer-Facing Website

The customer site is server-rendered using **Express.js** and **Handlebars** (hbs).

### Pages

| Route | Template | Description |
|---|---|---|
| `GET /` | `index.hbs` | Home page with welcome message |
| `GET /travel` | `travel.hbs` | Lists all trips with images, names, and descriptions |
| `GET /travel/:tripCode` | `travel-detail.hbs` | Detailed view of a single trip (image, duration, dates, resort, price) |

### How it works

1. The travel controller (`app_server/controllers/travel.js`) makes an internal HTTP request to the REST API at `http://localhost:3000/api/trips`
2. The API queries MongoDB via Mongoose and returns trip data as JSON
3. The controller passes the data to the Handlebars template for rendering
4. Static assets (images, CSS) are served from the `public/` directory

### Static pages

Additional static HTML pages are served directly from `public/`: Rooms, Meals, News, About, Contact.

---

## Admin SPA (Angular)

The admin panel is an **Angular 19** single-page application using standalone components and Bootstrap 5.3.2 for styling.

### Routes

| Route | Component | Description |
|---|---|---|
| `/` | `TripListingComponent` | Displays all trips as cards |
| `/add-trip` | `AddTripComponent` | Form to create a new trip (requires login) |
| `/edit-trip` | `EditTripComponent` | Form to edit an existing trip (requires login) |
| `/login` | `LoginComponent` | Login form for admin access |

### Features

- **Trip Listing**: Displays all trips in card format with image, resort, duration, price, and description
- **Add Trip**: Reactive form with validation for all trip fields (visible only when logged in)
- **Edit Trip**: Pre-populated reactive form to update trip details (visible only when logged in)
- **Login**: Template-driven form for admin authentication
- **Navbar**: Dynamic navigation showing "Log In" or "Log Out" based on authentication state
- **JWT Interceptor**: Automatically attaches Bearer token to API requests for authenticated operations

### Services

| Service | Purpose |
|---|---|
| `TripDataService` | HTTP client for all API calls (trips CRUD, login, register) |
| `AuthenticationService` | Token management (save, retrieve, decode), login state, user info |

---

## Data Models

### Trip Schema (MongoDB)

| Field | Type | Required | Indexed |
|---|---|---|---|
| `code` | String | Yes | Yes |
| `name` | String | Yes | Yes |
| `length` | String | Yes | No |
| `start` | Date | Yes | No |
| `resort` | String | Yes | No |
| `perPerson` | String | Yes | No |
| `image` | String | Yes | No |
| `description` | String | Yes | No |

### User Schema (MongoDB)

| Field | Type | Required | Unique |
|---|---|---|---|
| `email` | String | Yes | Yes |
| `name` | String | Yes | No |
| `hash` | String | No | No |
| `salt` | String | No | No |

**Instance methods on User:**

| Method | Description |
|---|---|
| `setPassword(password)` | Generates salt, hashes password with PBKDF2, stores both |
| `validPassword(password)` | Re-hashes input with stored salt, compares to stored hash |
| `generateJWT()` | Signs and returns a JWT containing user `_id`, `email`, and `name` |

---

## Technologies Used

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.22 | Web framework |
| MongoDB | 6+ | NoSQL database |
| Mongoose | 9.2 | MongoDB object modeling (ODM) |
| Handlebars (hbs) | 4.2 | Server-side template engine |
| Passport.js | 0.7 | Authentication middleware |
| passport-local | 1.0 | Local (email/password) authentication strategy |
| jsonwebtoken | 9.0 | JWT creation and verification |
| dotenv | 17.3 | Environment variable management |
| Morgan | 1.10 | HTTP request logger |

### Frontend (Admin)

| Technology | Version | Purpose |
|---|---|---|
| Angular | 19.2 | Frontend SPA framework |
| TypeScript | 5.7 | Typed JavaScript |
| Bootstrap | 5.3.2 | CSS framework (via CDN) |
| RxJS | 7.8 | Reactive programming for HTTP calls |

### Security

| Feature | Implementation |
|---|---|
| Password hashing | PBKDF2 (SHA-512, 1000 iterations, 64-byte key) |
| Authentication | Passport.js LocalStrategy |
| Authorization | JWT (1-hour expiry) |
| CORS | Configured for `http://localhost:4200` on `/api` routes |

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `Mongoose connection error` | Ensure MongoDB is running (`brew services start mongodb-community` on macOS) |
| 404 on `/travel` page | Verify MongoDB is running and trips are seeded (`npm run seed`) |
| Images not loading on `/travel` | Image `src` must use `/images/` prefix (e.g., `/images/reef1.jpg`) |
| CORS errors from Angular admin | Ensure the Express server is running on port 3000 |
| Login not working | Ensure `JWT_SECRET` is set in `.env` and a user has been registered via `/api/register` |
| Angular admin won't start | Run `npm install` inside `app_admin/` and ensure Angular CLI is installed globally |

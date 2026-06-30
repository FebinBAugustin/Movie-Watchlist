# Reel List — Backend API Service

This is the backend API service for the Reel List Movie Watchlist application. Built with **Node.js**, **Express**, and **MongoDB** (via **Mongoose**), it handles user authentication, password encryption, JWT generation, and full CRUD operations for the user's movie watchlist along with analytics aggregation.

---

## 🛠️ Setup & Installation

### 1. Install Dependencies
Navigate to this directory and install all required Node modules:
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a file named `.env` in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/movie-watchlist
JWT_SECRET=your_jwt_super_secret_key
```

- `PORT`: The port number on which the Express server will listen (defaults to `5000`).
- `MONGO_URI`: The connection URI to your MongoDB instance.
- `JWT_SECRET`: A secure key used to sign and verify JSON Web Tokens.

---

## 🏃 Run Scripts

- **Development Mode** (Runs with `nodemon` for auto-reloading on changes):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

---

## 📡 API Endpoints Reference

All API routes require authentication unless marked as **Public**. For protected routes, you must provide the JWT in the HTTP headers as follows:
`Authorization: Bearer <your_jwt_token>`

### 🔑 Authentication Routes (`/api/auth`)

#### 1. Register User [Public]
- **Method & Path**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 2. User Login [Public]
- **Method & Path**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### 3. Get User Profile [Protected]
- **Method & Path**: `GET /api/auth/profile`
- **Response (200 OK)**:
  ```json
  {
    "_id": "60d0fe4f5311236168a109ca",
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

---

### 🎬 Movie Watchlist Routes (`/api/movies`)

#### 1. Retrieve Watchlist [Protected]
- **Method & Path**: `GET /api/movies`
- **Response (200 OK)**: Returns an array of watchlist items sorted by newest addition first.
  ```json
  [
    {
      "_id": "60d10b7f5311236168a109cb",
      "title": "Inception",
      "genre": "Action, Sci-Fi",
      "rating": 9,
      "watched": true,
      "status": "Watched",
      "review": "Mind-bending masterpiece!",
      "poster": "https://m.media-amazon.com/images/...jpg",
      "year": "2010",
      "imdbID": "tt1375666",
      "trailer": "https://www.youtube.com/watch?v=YoHD9XEInc0",
      "user": "60d0fe4f5311236168a109ca",
      "createdAt": "2026-06-30T12:00:00.000Z",
      "updatedAt": "2026-06-30T12:30:00.000Z"
    }
  ]
  ```

#### 2. Add Movie to Watchlist [Protected]
- **Method & Path**: `POST /api/movies`
- **Request Body**:
  ```json
  {
    "title": "Interstellar",
    "genre": "Adventure, Drama, Sci-Fi",
    "poster": "https://m.media-amazon.com/images/...jpg",
    "year": "2014",
    "imdbID": "tt0816692",
    "trailer": "https://www.youtube.com/watch?v=zSWdZAToXRw"
  }
  ```
- **Response (201 Created)**: Returns the newly created movie document.

#### 3. Update Watchlist Movie [Protected]
- **Method & Path**: `PUT /api/movies/:id`
- **Request Body** (All fields optional):
  ```json
  {
    "status": "Watched",
    "rating": 10,
    "review": "Spectacular visual and emotional journey.",
    "watched": true,
    "trailer": "https://www.youtube.com/watch?v=zSWdZAToXRw"
  }
  ```
- **Response (200 OK)**: Returns the updated movie document.

#### 4. Remove Movie from Watchlist [Protected]
- **Method & Path**: `DELETE /api/movies/:id`
- **Response (200 OK)**:
  ```json
  {
    "message": "Movie removed"
  }
  ```

#### 5. Get Aggregate Statistics [Protected]
- **Method & Path**: `GET /api/movies/stats`
- **Response (200 OK)**:
  ```json
  {
    "moviesWatched": 12,
    "averageRating": 8.4
  }
  ```

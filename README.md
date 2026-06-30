# Reel List — Movie Watchlist Application

Reel List is a premium, full-stack Movie Watchlist application designed to help movie lovers search, discover, track, and review their favorite films. Built with a modern responsive UI and a robust Express + MongoDB backend, this application provides an immersive workspace to manage your film collection.

---

## 🌟 Key Features

### 🎬 Frontend & UX
- **Dynamic Search & Discovery**: Find any movie instantly powered by the OMDb API. Includes hydrated detail details (genres, year, directors, cast, rating).
- **Trending Highlights**: Discover featured trending titles right on the homepage upon landing.
- **Advanced Filtering & Sorting**: Group your search results or watchlist by Genre, Country, Year, and sort them dynamically.
- **Glassmorphic Design System**: Modern dark & light mode configurations supported via a reactive theme toggler (`ThemeContext`).
- **Interactive Modals**: Seamlessly view movie plots, key crew, trailer links, and add personal rating/review edits in a clean, overlay card interface.
- **Personal Watchlist**: Custom workspace where users can track movies, select status (`Plan to Watch`, `Watching`, `Watched`, `Dropped`), rate on a 10-star scale, and compose personal reviews.
- **User Dashboard & Analytics**: Visualize stats (total movies watched, average watchlist rating) directly in the personalized User Profile section.
- **JWT-Guarded Routes**: Secure route protection with custom React Router wrapper (`ProtectedRoute`).

### ⚙️ Backend API
- **Express & Node.js API Service**: Fast, modular routing structure utilizing Mongoose schemas.
- **MongoDB Data Persistence**: Secure and scalable document storage for users and watchlist movies.
- **JWT Authentication**: Full user signup and login cycles with encrypted passwords (`bcryptjs`).
- **Aggregation Stats**: Custom endpoints to compute aggregate statistics for user-specific watchlists.

---

## 📂 Project Structure

```
Movie-Watchlist/
├── backend/                  # Node.js + Express API backend
│   ├── config/               # Database connection settings
│   ├── controllers/          # Request handler functions (auth, movie)
│   ├── middleware/           # JWT verification middlewares
│   ├── models/               # MongoDB models & schemas (User, Movie)
│   ├── routes/               # API endpoint routers
│   ├── utils/                # Utility helpers
│   ├── server.js             # Main server execution file
│   └── package.json          # Backend dependencies & scripts
├── src/                      # React frontend source code
│   ├── components/           # Reusable UI components (Navbar, MovieCard, Modals)
│   ├── context/              # Context providers (ThemeContext)
│   ├── pages/                # App pages (Home, Login, Register, Watchlist, Profile)
│   ├── services/             # Axios API service callers (auth, movie, watchlist)
│   ├── App.jsx               # Main React routes configuration
│   ├── main.jsx              # React entry point file
│   └── index.css             # Tailwind v4 custom stylesheets & themes
├── index.html                # Frontend entry HTML shell
├── package.json              # Frontend package manager configuration
├── vite.config.js            # Vite bundle configuration
└── README.md                 # Project overall documentation
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) and [MongoDB](https://www.mongodb.com/) installed and running on your local machine.

---

### 1. Backend Setup & Run

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` configuration file inside the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/movie-watchlist
   JWT_SECRET=your_jwt_super_secret_key
   ```
   > [!NOTE]
   > Replace the `MONGO_URI` and `JWT_SECRET` variables with your actual local database URI and secret key signature.

4. Start the backend development server (runs on `http://localhost:5000` by default):
   ```bash
   npm run dev
   ```

---

### 2. Frontend Setup & Run

1. Navigate to the project root directory:
   ```bash
   cd ..
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` configuration file in the project root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   *This connects your frontend application with the backend API endpoints.*

4. Launch the frontend development server:
   ```bash
   npm run dev
   ```
   *The client application should open in your browser, typically at `http://localhost:5173`.*

---

## 🛠️ Technology Stack

- **Frontend**: React (v18), Vite, React Router DOM (v6), Tailwind CSS (v4), Axios, Lucide React, React Hot Toast.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JSON Web Tokens (JWT), BcryptJS, Nodemon.
- **API Data Provider**: OMDb API.

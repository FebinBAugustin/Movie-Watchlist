# Movie Watchlist — Client (Member 1 scope)

Frontend UI for the Movie Watchlist App: Login, Register, Navbar, Home page shell,
and responsive layout. Built with React + Vite + Tailwind + React Router.

## What's in here

```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # responsive nav with login/logout state
│   │   ├── FormField.jsx       # shared input used by Login/Register
│   │   └── ProtectedRoute.jsx  # redirects to /login if not authenticated
│   ├── pages/
│   │   ├── Home.jsx            # hero + placeholder slot for Member 2
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Watchlist.jsx       # placeholder for Member 2
│   │   └── Profile.jsx         # placeholder stats for Member 4
│   ├── services/
│   │   └── authService.js      # axios calls to /register and /login
│   ├── App.jsx                 # routes
│   ├── main.jsx                # entry point
│   └── index.css
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Run it locally

You need Node.js installed (v18+ recommended).

```bash
cd client
npm install
npm run dev
```

This starts the dev server, usually at `http://localhost:5173`.

The login/register forms call `http://localhost:5000/api/login` and
`/register` by default (Member 3's Express server). If the backend isn't
running yet, the pages still render — submitting will just show an error
message, which is expected.

To point at a different backend URL, create a `.env` file in `client/`:

```
VITE_API_URL=http://localhost:5000/api
```

## How to get this into your team's repo (step by step)

Use this if your team already created a GitHub repo for the project (e.g. named
`movie-watchlist`) and you need to add this client code to it.

### Option A — repo already exists on GitHub, you're cloning fresh

1. Open VS Code → Terminal → New Terminal.
2. Clone the repo:
   ```bash
   git clone https://github.com/YOUR-TEAM/movie-watchlist.git
   cd movie-watchlist
   ```
3. Copy everything from this `client/` folder into the repo's `client/` folder
   (create the folder if it doesn't exist yet).
4. Stage and commit:
   ```bash
   git add client/
   git commit -m "Add client: navbar, login/register pages, home shell"
   git push origin main
   ```
   If your team uses branches per member instead of pushing straight to `main`:
   ```bash
   git checkout -b member1-frontend
   git add client/
   git commit -m "Add client: navbar, login/register pages, home shell"
   git push origin member1-frontend
   ```
   Then open a Pull Request on GitHub into `main` so your teammates can review.

### Option B — you're starting the repo from scratch

1. Open VS Code, then File → Open Folder → select an empty folder where you
   want the project.
2. Copy this entire `client/` folder into it (so you have `your-project/client/`).
3. In the VS Code terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: client setup with auth pages and navbar"
   ```
4. Create an empty repo on GitHub (no README, no .gitignore — you already have one)
   named `movie-watchlist`, then:
   ```bash
   git remote add origin https://github.com/YOUR-TEAM/movie-watchlist.git
   git branch -M main
   git push -u origin main
   ```
5. Share the repo link with your 3 teammates and add them as collaborators
   (GitHub repo → Settings → Collaborators → Add people).

### Day-to-day workflow after that

- Always `git pull` before you start working, so you have your teammates' latest changes.
- Work in a branch per feature if your team agreed to that:
  ```bash
  git checkout -b fix-navbar-spacing
  # make changes
  git add .
  git commit -m "Fix navbar spacing on mobile"
  git push origin fix-navbar-spacing
  ```
  then open a Pull Request on GitHub.
- If you're all just pushing to `main` directly (fine for a 3-day mini project),
  just remember to `git pull` first each time to avoid conflicts.

## Notes for the rest of the team

- **Member 2**: the placeholder boxes in `Home.jsx` and `Watchlist.jsx` mark
  exactly where your search bar, movie cards, and watchlist table should go.
  Keep using the existing color tokens (`bg-stub`, `text-ink`, `text-brass`, etc.)
  defined in `tailwind.config.js` so the new UI matches.
- **Member 3**: the frontend expects `POST /api/register` and `POST /api/login`
  to return `{ token, user }` on success. Adjust `authService.js` if your
  response shape differs.
- **Member 4**: `Profile.jsx` has two placeholder stats (movies watched,
  average rating) ready for you to wire up once the watchlist stats endpoint exists.

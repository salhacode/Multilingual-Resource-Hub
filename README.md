# Multilingual Resource Hub

A multilingual mental health resource directory for communities across the United States. Helps users discover culturally responsive support — therapists, hotlines, community clinics, and nonprofits — in 25+ languages including Spanish, Arabic, Mandarin, Haitian Creole, Tagalog, Russian, Korean, Vietnamese, Hindi, Urdu, and more.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Supabase in production)

## Features

- Browse 19+ curated US-based mental health resources
- Filter by language or topic (crisis, therapy, community, etc.)
- Add, edit, and delete resources through the UI
- Each resource lists all supported languages, target communities, and a direct link

## Local development

### Prerequisites
- Node.js 20+
- PostgreSQL (local) or a hosted database URL

### Setup
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root:
   ```bash
   VITE_API_BASE_URL=http://localhost:4000
   DATABASE_URL=postgresql://user:password@host:port/database
   ```
3. Create the database schema and load sample data:
   ```bash
   npm run backend:migrate
   npm run backend:seed
   ```
4. Run the backend and frontend in two terminals:
   ```bash
   npm run backend:dev   # API on http://localhost:4000
   npm run dev           # Frontend on http://localhost:5173
   ```

## Production build (single service)

```bash
npm run build     # builds React into ./dist
npm start         # starts Express serving the API + the built frontend
```

In production the Express server serves the built `dist/` folder, so everything runs on one port.

## Project structure

```
backend/
  db/
    migrations/   SQL files run in order by `npm run backend:migrate`
    pool.js       Postgres connection (loads .env, auto-enables SSL for remote hosts)
  routes/         Express API routes
  scripts/        migrate.js, seed.js
  server.js       Express entry point
src/
  App.jsx         Main React component
  services/       API client (resourcesApi.js)
```

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/resources` | List all resources |
| `POST` | `/api/resources` | Create a new resource |
| `PUT` | `/api/resources/:id` | Update a resource |
| `DELETE` | `/api/resources/:id` | Delete a resource |

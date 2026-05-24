# Multilingual Resource Hub

A multilingual mental health resource directory for communities across the United States. Helps users discover culturally responsive support — therapists, hotlines, community clinics, and nonprofits — in 25+ languages including Spanish, Arabic, Mandarin, Haitian Creole, Tagalog, Russian, Korean, Vietnamese, Hindi, Urdu, and more.

## Live demo

**https://multilingual-resource-hub.onrender.com/**

## Team

Individual project — Salma Halim

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (Supabase in production)
- **Deployment:** Render (single web service serving API + built frontend)

## Features

- Browse 20 curated US-based mental health resources
- Filter by language or topic (crisis, therapy, community, etc.)
- Add, edit, and delete resources through the UI
- Each resource lists all supported languages, target communities, and a direct link
- Loading and error states when communicating with the API

## Local development

### Prerequisites

- Node.js 20+
- PostgreSQL (local) or a hosted database URL

### Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/salhacode/Multilingual-Resource-Hub.git
   cd Multilingual-Resource-Hub
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

## Deployment (Render)

1. Push the project to GitHub.
2. Create a **Web Service** on [Render](https://render.com) connected to the repo.
3. Set environment variables:
   - `DATABASE_URL` — your Supabase (or other hosted Postgres) connection string
4. Use:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
5. Run migrations and seed once against the production database:

   ```bash
   npm run backend:migrate
   npm run backend:seed
   ```

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

## Reflections

I built this hub to help people find US mental health resources that offer support in their language. Each listing shows which languages and topics it covers, and users can filter to narrow the list. I researched every entry, checked the links, and wrote descriptions based on what each organization actually provides.

Technically, I learned how to wire a React frontend to an Express API with PostgreSQL, handle CORS and environment variables across dev vs production, and deploy frontend + backend as a single service on Render with Supabase as the database. Setting up migrations and seed data made it easier to reset and demo the app consistently.

Challenges included debugging “Failed to fetch” (CORS and API base URL issues), moving from local Postgres to Supabase with SSL, and iterating on UI layout so resource cards stay readable when descriptions and language lists vary in length.

## AI tools used

- **Cursor** — primary development environment; used for implementing features, debugging (Postgres, Vite cache, deployment), verifying resource URLs, and drafting this README.
- AI assistance was used for code suggestions and troubleshooting; all architectural decisions, data curation, and final code were reviewed and tested locally and on the deployed site.

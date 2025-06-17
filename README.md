# Decodex

Decodex is a tool for analyzing source code. The web UI is located in the `frontend` directory.

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173> in your browser to view the application.

To create a production build:

```bash
npm run build
npm run preview
```

## Running the backend

The backend is a small NestJS service. Start it in watch mode during development:

```bash
cd backend
npm install
npm run start:dev
```

The HTTP API will be available on <http://localhost:3000>.

Configure the MySQL connection using these environment variables:

- `DB_HOST` – database host (default `localhost`)
- `DB_USERNAME` – database user (default `root`)
- `DB_PASSWORD` – database password (default `password`)
- `DB_NAME` – database name (default `decodex`)

A basic schema is available in `backend/schema.sql` and can be imported to
initialize the database.

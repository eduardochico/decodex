# Decodex

Decodex is a tool for analyzing source code. It consists of a React frontend and a NestJS backend service.

## Frontend

The frontend is located in the `frontend` directory and uses Vite, TypeScript and Material UI.

### Development

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173> to view the application.

### Building

For a production build and preview:

```bash
npm run build
npm run preview
```

## Backend

The backend is a minimal NestJS service that exposes CRUD endpoints using MySQL through TypeORM.

### Development

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

A basic schema is available in `backend/schema.sql` and can be imported to initialize the database.

### Build

```bash
npm run build
```

The build output is generated in `dist/`.

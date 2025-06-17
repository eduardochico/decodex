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

The service expects a MySQL database. The database host, username and password
are read from the environment variables `DB_HOST`, `DB_USERNAME` and
`DB_PASSWORD` respectively. When these variables are not provided the service
falls back to `localhost`, `root` and `password`.
A basic schema is available in `backend/schema.sql` and can be imported to
initialize the database.

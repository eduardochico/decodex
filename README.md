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

### Environment variables

You can override the backend API URL used by the frontend by creating a `.env`
file in the `frontend` directory:

```bash
VITE_API_URL=http://localhost:3000
```

If omitted, the application defaults to `http://localhost:3000`.

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

The project declares several Tree-sitter grammars as dependencies. Running
`npm install` fetches them automatically. These packages are required by the
scanner; without them the service will error with messages such as
`Cannot find module 'tree-sitter-typescript'`.

The HTTP API will be available on <http://localhost:3000>.

Configure the MySQL connection using these environment variables:

- `DB_HOST` – database host (default `localhost`)
- `DB_USERNAME` – database user (default `root`)
- `DB_PASSWORD` – database password (default `password`)
- `DB_NAME` – database name (default `decodex`)
- `OPENAI_API_KEY` – OpenAI API key used for answering questions about scanned code

A basic schema is available in `backend/schema.sql` and can be imported to initialize the database.

### Build

```bash
npm run build
```

The build output is generated in `dist/`.

## Scripts

A helper script `scripts/run-tree-sitter.sh` clones a repository and uses tree-sitter to parse all JavaScript files. Usage:

```bash
./scripts/run-tree-sitter.sh <repo_url> <grammar_repo_url>
```

The script creates a temporary working directory, clones both repositories, generates the grammar, and parses each `*.js` file found in the target repository.

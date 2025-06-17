# Decodex Backend

This is a minimal NestJS service providing CRUD endpoints for applications. It uses MySQL through TypeORM.

## Development

Install dependencies and start the service in watch mode:

```bash
npm install
npm run start:dev
```

The HTTP API will be available on `http://localhost:3000`.

Configure the MySQL connection using these environment variables:

- `DB_HOST` – database host (default `localhost`)
- `DB_USERNAME` – database user (default `root`)
- `DB_PASSWORD` – database password (default `password`)
- `DB_NAME` – database name (default `decodex`)

## Build

```bash
npm run build
```

The build output is in `dist/`.

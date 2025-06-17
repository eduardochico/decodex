# Decodex Backend

This is a minimal NestJS service providing CRUD endpoints for applications. It uses MySQL through TypeORM.

## Development

Install dependencies and start the service in watch mode:

```bash
npm install
npm run start:dev
```

The HTTP API will be available on `http://localhost:3000`.

The service connects to a MySQL database. The host, username, password and
database name can be configured through the environment variables `DB_HOST`,
`DB_USERNAME`, `DB_PASSWORD` and `DB_NAME`. Default values are `localhost`,
`root`, `password` and `decodex`.

## Build

```bash
npm run build
```

The build output is in `dist/`.

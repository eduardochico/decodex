# Decodex Backend

This is a minimal NestJS service providing CRUD endpoints for applications. It uses MySQL through TypeORM.

## Development

Install dependencies and start the service in watch mode:

```bash
npm install
npm run start:dev
```

The HTTP API will be available on `http://localhost:3000`.

The service connects to a MySQL database. The host, username and password can be
configured through the environment variables `DB_HOST`, `DB_USERNAME` and
`DB_PASSWORD`. Default values are `localhost`, `root` and `password`.

## Build

```bash
npm run build
```

The build output is in `dist/`.

# Event Management System

## 1. Install database

To install database, you must already have PostgreSQL server installed on your machine. <br>
The full database installation file is already provided in the folder called 'sql'. <br>
Run the following command. When there is a password prompt, type `postgres` for the default password .
```bash
psql -U postgres -f .\sql\ems_db_full_installation.sql
```

## 2. Install dependencies

Install all dependencies.

```bash
# install dependencies
npm install
```

## Start the server

To start the server, type the following command in your terminal. <br>
Depending on your machine, it will show you the URL to the app.

```bash
npm run dev
```

## Testing

Run the tests by typing the following command.
```bash
npx playwright test --workers=1
```

# Intelligent Property Platform

This repo runs as two apps:

- `backend`: Express + Prisma + PostgreSQL API
- `frontend`: Next.js web app

The root `package.json` looks like leftover scaffold metadata and does not contain an app source tree, so the runnable project lives in `backend` and `frontend`.

## Requirements

- Node.js 20+
- npm 10+
- Python 3.11+
- PostgreSQL 16+ with the `pgvector` extension available

## Environment

Create these files before starting the project:

- `backend/.env`
  - copy from `backend/.env.example`
- `frontend/.env.local`
  - copy from `frontend/.env.local.example`

Required backend variables:

- `DATABASE_URL`
- `JWT_SECRET`

Required frontend variables:

- `NEXT_PUBLIC_API_URL`

## Install

Backend:

```powershell
cd backend
npm.cmd install
py -3 -m pip install -r requirements.txt
```

Frontend:

```powershell
cd frontend
npm.cmd install
```

## Database

After PostgreSQL is running and `DATABASE_URL` is set:

```powershell
cd backend
npx prisma generate
npx prisma migrate deploy
```

If `pgvector` is not installed yet, create it in the target database before starting the API:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Run

Start the backend:

```powershell
cd backend
npm.cmd run dev
```

Start the frontend in another terminal:

```powershell
cd frontend
npm.cmd run dev
```

Frontend default URL: `http://localhost:3000`

Backend default URL: `http://localhost:5000`

# Auth Server

Local Express + MongoDB auth server for Project Structura.

Setup

1. Install dependencies

```
cd server
npm install
```

2. (Optional) Copy `.env.example` to `.env` for custom settings (MongoDB URI, JWT secret)

3. Start server

```
npm run dev
```

By default, the server starts with an **in-memory MongoDB** (no setup needed). To use an external MongoDB, set `MONGO_URI` in `.env`.

API

- POST `/api/auth/signup` { firstName, lastName, username, email, password }
- POST `/api/auth/signin` { email, password }
- GET `/api/auth/me` (requires `Authorization: Bearer <token>`)

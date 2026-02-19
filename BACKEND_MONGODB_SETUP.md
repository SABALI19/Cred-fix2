# MongoDB Backend Setup (Node + Express)

## 1. Install backend dependencies

```bash
cd server
npm install
```

## 2. Configure environment

Copy `server/.env.example` to `server/.env` and update values:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/creditfix
CORS_ORIGIN=http://localhost:5173
```

## 3. Start backend

From project root:

```bash
npm run server:dev
```

Health check:

`GET http://localhost:5000/api/health`

## 4. API endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `PATCH /api/auth/me` (Bearer token)
- `POST /api/auth/logout` (Bearer token)
- `GET /api/credit/accounts` (Bearer token)
- `POST /api/credit/accounts` (Bearer token)
- `PATCH /api/credit/accounts/:id` (Bearer token)
- `DELETE /api/credit/accounts/:id` (Bearer token)
- `GET /api/credit/scores` (Bearer token)
- `POST /api/credit/scores` (Bearer token)
- `GET /api/credit/scores/latest` (Bearer token)
- `GET /api/credit/summary` (Bearer token)
- `GET /api/disputes` (Bearer token)
- `POST /api/disputes` (Bearer token)
- `PATCH /api/disputes/:id` (Bearer token)
- `DELETE /api/disputes/:id` (Bearer token)
- `GET /api/disputes/stats/summary` (Bearer token)
- `GET /api/disputes/stats/by-bureau` (Bearer token)
- `POST /api/contact`
- `GET /api/contact`
- `POST /api/support-tickets`
- `GET /api/support-tickets` (Bearer token optional, supports `?email=...`)
- `GET /api/consultations`
- `POST /api/consultations`

`POST /api/consultations` body example:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-123-9876",
  "message": "I want to book a consultation."
}
```

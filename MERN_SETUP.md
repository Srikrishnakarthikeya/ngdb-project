# MERN Migration Setup

The project is now split into:

- `frontend/` — React and Vite application
- `backend/` — Express API and Mongoose/MongoDB models

## MongoDB with MongoDB Compass

1. Start MongoDB locally.
2. Open MongoDB Compass.
3. Connect using:
   `mongodb://127.0.0.1:27017`
4. Copy `backend/.env.example` to `backend/.env`.
5. The default database name will be `nitt_ca_ems`.

## Install and seed

From the project root in one PowerShell terminal:

```powershell
cd backend
npm install
npm run seed
npm run dev
```

Keep the backend running on port 5000.

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## MongoDB structure

The backend creates collections such as:

- departments
- venues
- coordinators
- events
- eventCoordinators
- sponsors
- publicity
- participants
- registrations
- accommodations
- hospitality
- evaluations
- certificates
- completionReports
- photographs
- notifications
- users
- wallets
- wallettopup

The Mongoose model definitions are in `backend/src/models/index.js`.

## API

- Health: `GET /api/health`
- Bootstrap all data: `GET /api/bootstrap`
- Generic collections: `GET|POST /api/<collection>`
- Generic update/delete: `PUT|DELETE /api/<collection>/<business-id>`
- Student auth: `/api/auth/student/register`, `/api/auth/student/login`
- Staff auth: `/api/auth/staff/login`
- Wallet: `/api/wallets/:participantId`, `/api/wallets/:participantId/credit`

The frontend Vite server forwards `/api` requests to Express at port 5000.

## Demo accounts after seed

Student: `prasad45@gmail.com`, password `demoPass123`

Student: `xyz@gmail.com`, password `demoPass123`

Admin: `admin@gmail.com`, password `adminPass123`

Coordinator: `coordinator@example.com`, password `demoPass123`

## Resetting seeded data

```powershell
cd backend
$env:RESET_DATABASE="true"
npm run seed
```

On Windows PowerShell, that temporary environment variable applies only to the seed process in that shell.

## Important next security steps

Before a real deployment:

1. Add JWT authentication middleware to protected routes.
2. Replace permissive generic CRUD routes with role checks.
3. Define strict Mongoose schemas instead of temporary flexible schemas.
4. Add server-side transaction logic for wallet payments and registrations.
5. Use a real payment gateway instead of the demo QR flow.
6. Add input validation and database indexes.

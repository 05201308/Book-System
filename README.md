# Community Library Management System

React frontend + Express backend + PostgreSQL database.

## Folders
- `backend/`  - Express API (routes for /books, /transactions, /users) and `schema.sql`
- `frontend/` - React app (Vite, React Router, hooks, Fetch API)

## How to run

You need Node.js and PostgreSQL installed, and PostgreSQL must be running.

### 1. Backend
```
cd backend
npm install
npm start
```
The backend creates the `library_db` database, the tables and the starting data by itself the first time it starts.
It runs on http://localhost:5000 and prints "Database ready." when it is OK.

If your PostgreSQL has a password, open `backend/db.js` and type it on the `password` line, then run `npm start` again.
If something is wrong, the backend window prints a clear message (wrong password, PostgreSQL not running, etc.).

### 2. Frontend (open a second terminal)
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

`backend/schema.sql` is the same table setup as SQL, in case you want to run it by hand in pgAdmin (it also resets the data).

## Logins
| Membership ID | Password  | Role   |
|---------------|-----------|--------|
| ADMIN001      | admin123  | admin  |
| MEM001        | member123 | member |

## API
| Method | Route                | What it does                          |
|--------|----------------------|---------------------------------------|
| GET    | /books               | list books                            |
| POST   | /books               | add a book                            |
| PUT    | /books/:id           | update a book                         |
| DELETE | /books/:id           | delete a book                         |
| GET    | /transactions        | transaction history                   |
| POST   | /transactions        | add stock ("add") or borrow ("borrow")|
| POST   | /users/login         | login                                 |
| GET    | /users               | list users                            |
| POST   | /users               | add a user                            |
| PUT    | /users/:id           | update a user                         |
| DELETE | /users/:id           | delete a user                         |

## Notes
- Borrowing is refused if there are not enough copies in stock.
- Books with fewer than 2 copies are highlighted on the Dashboard and Books page.
- Passwords are stored as plain text to keep the project simple. A real system should hash them (for example with bcrypt).

# CRUD App

A full-stack task manager: **FastAPI** backend, **React** frontend, and **PostgreSQL** database, all orchestrated with Docker Compose.

## Stack

| Layer    | Technology                        | Port |
| -------- | --------------------------------- | ---- |
| Frontend | React (served by nginx)           | 3000 |
| Backend  | FastAPI + SQLAlchemy (uvicorn)    | 8000 |
| Database | PostgreSQL 16                     | 5432 |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (included with Docker Desktop)

That's all you need for the recommended path below. For running services individually, you'll also want Python 3.12 and Node.js 20.

## Quick start (Docker)

From the project root:

```bash
docker compose up --build
```

This builds the images and starts all three services. The backend waits for the database to be healthy before starting.

Once it's up:

- **App (frontend):** http://localhost:3000
- **API docs (Swagger UI):** http://localhost:8000/docs
- **Health check:** http://localhost:8000/health

To run it in the background, add `-d`:

```bash
docker compose up --build -d
```

### Stopping

```bash
docker compose down        # stop and remove containers
docker compose down -v     # also delete the database volume (wipes all data)
```

### Useful commands

```bash
docker compose ps             # list running services
docker compose logs -f backend   # tail backend logs
docker compose exec backend sh   # shell into the backend container
```

## API endpoints

The backend exposes a REST API for tasks (explore interactively at `/docs`):

| Method   | Path               | Description          |
| -------- | ------------------ | -------------------- |
| `GET`    | `/health`          | Service health check |
| `GET`    | `/tasks`           | List all tasks       |
| `POST`   | `/tasks`           | Create a task        |
| `GET`    | `/tasks/{task_id}` | Get a single task    |
| `PATCH`  | `/tasks/{task_id}` | Update a task        |
| `DELETE` | `/tasks/{task_id}` | Delete a task        |

Example:

```bash
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk and eggs"}'
```

## Running services individually (without Docker)

Useful for local development with hot reload.

### Database

The backend needs a PostgreSQL instance. The easiest option is to run just the database via Docker:

```bash
docker compose up db
```

### Backend

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cruddb
uvicorn main:app --reload --port 8000
```

> **Note:** The pinned dependencies require **Python 3.12** (3.13+ may fail to build `pydantic`/`psycopg2`).

### Frontend

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

The dev server runs at http://localhost:3000 and proxies API calls to the backend.

## Project structure

```
crud-app/
├── docker-compose.yml      # Orchestrates db, backend, and frontend
├── backend/                # FastAPI application
│   ├── main.py             # App entry point and routes
│   ├── crud.py             # Database operations
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # DB connection/session setup
│   ├── requirements.txt
│   └── Dockerfile
└── frontend/               # React application
    ├── src/
    │   ├── App.js
    │   ├── api.js          # Axios API client
    │   └── components/     # TaskForm, TaskItem (+ their CSS)
    ├── package.json
    └── Dockerfile
```

## Configuration

Configured via environment variables (defaults set in `docker-compose.yml`):

| Variable            | Service  | Description                          | Default                                              |
| ------------------- | -------- | ------------------------------------ | ---------------------------------------------------- |
| `DATABASE_URL`      | backend  | PostgreSQL connection string         | `postgresql://postgres:postgres@db:5432/cruddb`      |
| `REACT_APP_API_URL` | frontend | Backend URL the frontend calls       | `http://localhost:8000`                              |

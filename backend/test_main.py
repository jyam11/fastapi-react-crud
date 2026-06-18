import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app
from database import get_db, Base

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_task():
    response = client.post("/tasks", json={"title": "Test Task", "description": "Test desc"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["completed"] is False


def test_list_tasks():
    response = client.get("/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_task():
    create_res = client.post("/tasks", json={"title": "Get Task"})
    task_id = create_res.json()["id"]
    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["id"] == task_id


def test_update_task():
    create_res = client.post("/tasks", json={"title": "Old Title"})
    task_id = create_res.json()["id"]
    response = client.patch(f"/tasks/{task_id}", json={"title": "New Title", "completed": True})
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"
    assert response.json()["completed"] is True


def test_delete_task():
    create_res = client.post("/tasks", json={"title": "Delete Me"})
    task_id = create_res.json()["id"]
    response = client.delete(f"/tasks/{task_id}")
    assert response.status_code == 200
    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 404


def test_get_nonexistent_task():
    response = client.get("/tasks/99999")
    assert response.status_code == 404

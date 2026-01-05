import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from database import Base, get_db
from main import app
import database_models 

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_director(client):
    director_data = {
        "first_name": "Christopher",
        "last_name": "Nolan",
        "age": 54,
        "image_url": "https://example.com/nolan.jpg"
    }
    response = client.post("/api/v1/directors/", json=director_data)
    return response.json()


@pytest.fixture
def sample_actor(client):
    actor_data = {
        "first_name": "Leonardo",
        "last_name": "DiCaprio",
        "age": 49,
        "image_url": "https://example.com/leo.jpg"
    }
    response = client.post("/api/v1/actors/", json=actor_data)
    return response.json()


@pytest.fixture
def sample_genre(client):
    genre_data = {"type": "Sci-Fi"}
    response = client.post("/api/v1/genres/", json=genre_data)
    return response.json()


@pytest.fixture
def sample_movie(client, sample_director):
    movie_data = {
        "title": "Inception",
        "description": "A mind-bending thriller",
        "release_year": 2010,
        "image_url": "https://example.com/inception.jpg",
        "director_id": sample_director["id"],
        "rating": 8.8
    }
    response = client.post("/api/v1/movies/", json=movie_data)
    return response.json()


@pytest.fixture
def sample_review(client, sample_movie):
    review_data = {
        "movie_id": sample_movie["id"],
        "reviewer_name": "John Doe",
        "rating": 9.0,
        "comment": "Amazing movie!"
    }
    response = client.post("/api/v1/reviews/", json=review_data)
    return response.json()

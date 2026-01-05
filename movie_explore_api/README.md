# Movie Explorer API

A RESTful API for exploring movies, actors, directors, genres, and reviews built with FastAPI and SQLAlchemy.

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **MySQL** - Database
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **Docker** - Containerization

## Prerequisites

- Python 3.12+
- MySQL 8.0+ (or Docker)
- pip

## Getting Started

### Option 1: Run Locally

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie_explore_api
   ```

2. **Create virtual environment**
   ```bash
   python -m venv movieExploreEnv
   
   # Windows
   .\movieExploreEnv\Scripts\Activate.ps1
   
   # Linux/Mac
   source movieExploreEnv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up MySQL database**
   ```sql
   CREATE DATABASE movies_explore_db;
   ```

5. **Configure database connection** (optional)
   
   Set environment variable or update `database.py`:
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/movies_explore_db"
   
   # Linux/Mac
   export DATABASE_URL="mysql+pymysql://root:root@localhost:3306/movies_explore_db"
   ```

6. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

7. **Start the server**
   ```bash
   uvicorn main:app --reload
   ```

8. **Access the API**
   - API: http://localhost:8000
   - Swagger Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Option 2: Run with Docker

1. **Build and start containers**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode**
   ```bash
   docker-compose up -d --build
   ```

3. **Stop containers**
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes (wipes database)**
   ```bash
   docker-compose down -v
   ```

5. **Access the API**
   - API: http://localhost:8000
   - MySQL: localhost:3307 (user: root, password: root)

## API Endpoints

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/movies/` | Get all movies (with filters) |
| GET | `/api/v1/movies/{id}` | Get movie by ID |
| POST | `/api/v1/movies/` | Create a movie |
| PUT | `/api/v1/movies/{id}` | Update a movie |
| DELETE | `/api/v1/movies/{id}` | Delete a movie |
| POST | `/api/v1/movies/{id}/actors/{actor_id}` | Add actor to movie |
| DELETE | `/api/v1/movies/{id}/actors/{actor_id}` | Remove actor from movie |
| POST | `/api/v1/movies/{id}/genres/{genre_id}` | Add genre to movie |
| DELETE | `/api/v1/movies/{id}/genres/{genre_id}` | Remove genre from movie |

**Movie Filters:** `?title=`, `?genre=`, `?actor=`, `?director=`, `?release_year=`

### Actors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/actors/` | Get all actors (with filters) |
| GET | `/api/v1/actors/{id}` | Get actor by ID |
| POST | `/api/v1/actors/` | Create an actor |
| PUT | `/api/v1/actors/{id}` | Update an actor |
| DELETE | `/api/v1/actors/{id}` | Delete an actor |

**Actor Filters:** `?name=`, `?movie=`, `?genre=`

### Directors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/directors/` | Get all directors |
| GET | `/api/v1/directors/{id}` | Get director by ID |
| POST | `/api/v1/directors/` | Create a director |
| PUT | `/api/v1/directors/{id}` | Update a director |
| DELETE | `/api/v1/directors/{id}` | Delete a director |

**Director Filters:** `?name=`

### Genres
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/genres/` | Get all genres |
| GET | `/api/v1/genres/{id}` | Get genre by ID |
| POST | `/api/v1/genres/` | Create a genre |
| PUT | `/api/v1/genres/{id}` | Update a genre |
| DELETE | `/api/v1/genres/{id}` | Delete a genre |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reviews/` | Get all reviews (with filters) |
| GET | `/api/v1/reviews/{id}` | Get review by ID |
| POST | `/api/v1/reviews/` | Create a review |
| PUT | `/api/v1/reviews/{id}` | Update a review |
| DELETE | `/api/v1/reviews/{id}` | Delete a review |
| GET | `/api/v1/reviews/movie/{id}/average` | Get average rating for movie |

**Review Filters:** `?movie_id=`, `?min_rating=`

## Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_movies.py

# Run tests matching pattern
pytest -k "create"

# Run with coverage
pytest --cov=.
```

## Project Structure

```
movie_explore_api/
├── main.py                 # FastAPI application entry point
├── database.py             # Database configuration
├── database_models.py      # SQLAlchemy ORM models
├── models.py               # Pydantic schemas
├── requirements.txt        # Python dependencies
├── Dockerfile              # Docker image configuration
├── docker-compose.yml      # Docker services configuration
├── alembic.ini             # Alembic configuration
├── alembic/                # Database migrations
│   ├── env.py
│   └── versions/
├── routes/                 # API route handlers
│   ├── movies.py
│   ├── actors.py
│   ├── directors.py
│   ├── genres.py
│   └── reviews.py
└── tests/                  # Test files
    ├── conftest.py
    ├── test_movies.py
    ├── test_actors.py
    ├── test_directors.py
    ├── test_genres.py
    ├── test_reviews.py
    └── test_main.py
```

## Example Requests

### Create a Director
```bash
curl -X POST "http://localhost:8000/api/v1/directors/" \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Christopher", "last_name": "Nolan", "age": 54}'
```

### Create a Movie
```bash
curl -X POST "http://localhost:8000/api/v1/movies/" \
  -H "Content-Type: application/json" \
  -d '{"title": "Inception", "description": "A mind-bending thriller", "release_year": 2010, "director_id": 1}'
```

### Add Actor to Movie
```bash
curl -X POST "http://localhost:8000/api/v1/movies/1/actors/1"
```

### Get Movies with Filters
```bash
curl "http://localhost:8000/api/v1/movies/?genre=Sci-Fi&release_year=2010"
```

## License

MIT

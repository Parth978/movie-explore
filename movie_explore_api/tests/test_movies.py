import pytest
from fastapi import status


class TestMoviesEndpoints:
    """Tests for Movies CRUD endpoints."""

    def test_get_all_movies_empty(self, client):
        """Test getting all movies when database is empty."""
        response = client.get("/api/v1/movies/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []

    def test_create_movie_success(self, client, sample_director):
        """Test creating a movie successfully."""
        movie_data = {
            "title": "The Dark Knight",
            "description": "Batman faces the Joker",
            "release_year": 2008,
            "image_url": "https://example.com/dark-knight.jpg",
            "director_id": sample_director["id"],
            "rating": 9.0
        }
        response = client.post("/api/v1/movies/", json=movie_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["title"] == movie_data["title"]
        assert data["description"] == movie_data["description"]
        assert data["release_year"] == movie_data["release_year"]
        assert data["director_id"] == sample_director["id"]
        assert "id" in data

    def test_create_movie_invalid_director(self, client):
        """Test creating a movie with non-existent director."""
        movie_data = {
            "title": "Test Movie",
            "description": "Test description",
            "release_year": 2020,
            "image_url": "https://example.com/test.jpg",
            "director_id": 999,
            "rating": 7.0
        }
        response = client.post("/api/v1/movies/", json=movie_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Director with id 999 not found" in response.json()["detail"]

    def test_create_movie_duplicate_title(self, client, sample_movie, sample_director):
        """Test creating a movie with duplicate title."""
        movie_data = {
            "title": sample_movie["title"],  # Same title
            "description": "Different description",
            "release_year": 2020,
            "image_url": "https://example.com/test.jpg",
            "director_id": sample_director["id"],
            "rating": 7.0
        }
        response = client.post("/api/v1/movies/", json=movie_data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already exists" in response.json()["detail"]

    def test_get_movie_by_id_success(self, client, sample_movie):
        """Test getting a movie by ID."""
        response = client.get(f"/api/v1/movies/{sample_movie['id']}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_movie["id"]
        assert data["title"] == sample_movie["title"]

    def test_get_movie_by_id_not_found(self, client):
        """Test getting a non-existent movie."""
        response = client.get("/api/v1/movies/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Movie with id 999 not found" in response.json()["detail"]

    def test_update_movie_success(self, client, sample_movie, sample_director):
        update_data = {
            "title": "Inception Updated",
            "description": "Updated description",
            "release_year": 2010,
            "image_url": "https://example.com/updated.jpg",
            "director_id": sample_director["id"],
            "rating": 9.5
        }
        response = client.put(f"/api/v1/movies/{sample_movie['id']}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["title"] == update_data["title"]
        assert data["description"] == update_data["description"]

    def test_update_movie_not_found(self, client, sample_director):
        update_data = {
            "title": "Test",
            "description": "Test",
            "release_year": 2020,
            "image_url": "https://example.com/test.jpg",
            "director_id": sample_director["id"],
            "rating": 7.0
        }
        response = client.put("/api/v1/movies/999", json=update_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_movie_success(self, client, sample_movie):
        response = client.delete(f"/api/v1/movies/{sample_movie['id']}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify deletion
        get_response = client.get(f"/api/v1/movies/{sample_movie['id']}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_movie_not_found(self, client):
        response = client.delete("/api/v1/movies/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_filter_movies_by_title(self, client, sample_movie):
        response = client.get("/api/v1/movies/", params={"title": "Incep"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["title"] == sample_movie["title"]

    def test_filter_movies_by_release_year(self, client, sample_movie):
        response = client.get("/api/v1/movies/", params={"release_year": 2010})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["release_year"] == 2010

    def test_create_movie_validation_title_too_short(self, client, sample_director):
        movie_data = {
            "title": "AB",  # Less than 3 characters
            "description": "Test",
            "release_year": 2020,
            "image_url": "https://example.com/test.jpg",
            "director_id": sample_director["id"],
            "rating": 7.0
        }
        response = client.post("/api/v1/movies/", json=movie_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_movie_validation_invalid_year(self, client, sample_director):
        movie_data = {
            "title": "Test Movie",
            "description": "Test",
            "release_year": 1800,  # Before 1900
            "image_url": "https://example.com/test.jpg",
            "director_id": sample_director["id"],
            "rating": 7.0
        }
        response = client.post("/api/v1/movies/", json=movie_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

import pytest
from fastapi import status


class TestGenresEndpoints:

    def test_get_all_genres_empty(self, client):
        response = client.get("/api/v1/genres/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []

    def test_create_genre_success(self, client):
        genre_data = {"type": "Action"}
        response = client.post("/api/v1/genres/", json=genre_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["type"] == genre_data["type"]
        assert "id" in data

    def test_get_genre_by_id_success(self, client, sample_genre):
        response = client.get(f"/api/v1/genres/{sample_genre['id']}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_genre["id"]
        assert data["type"] == sample_genre["type"]

    def test_get_genre_by_id_not_found(self, client):
        response = client.get("/api/v1/genres/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Genre with id 999 not found" in response.json()["detail"]

    def test_update_genre_success(self, client, sample_genre):
        update_data = {"type": "Science Fiction"}
        response = client.put(f"/api/v1/genres/{sample_genre['id']}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["type"] == update_data["type"]

    def test_update_genre_not_found(self, client):
        update_data = {"type": "Drama"}
        response = client.put("/api/v1/genres/999", json=update_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_genre_success(self, client, sample_genre):
        response = client.delete(f"/api/v1/genres/{sample_genre['id']}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        get_response = client.get(f"/api/v1/genres/{sample_genre['id']}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_genre_not_found(self, client):
        response = client.delete("/api/v1/genres/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_create_multiple_genres(self, client):
        genres = ["Horror", "Comedy", "Drama", "Thriller"]
        
        for genre_type in genres:
            response = client.post("/api/v1/genres/", json={"type": genre_type})
            assert response.status_code == status.HTTP_201_CREATED
        
        response = client.get("/api/v1/genres/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 4

    def test_create_genre_validation_type_too_short(self, client):
        genre_data = {"type": "A"}  # Less than 2 characters
        response = client.post("/api/v1/genres/", json=genre_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_genre_validation_type_too_long(self, client):
        genre_data = {"type": "A" * 35}  # More than 30 characters
        response = client.post("/api/v1/genres/", json=genre_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

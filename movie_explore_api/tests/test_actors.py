import pytest
from fastapi import status


class TestActorsEndpoints:

    def test_get_all_actors_empty(self, client):
        response = client.get("/api/v1/actors/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []

    def test_create_actor_success(self, client):
        actor_data = {
            "first_name": "Tom",
            "last_name": "Hanks",
            "age": 67,
            "image_url": "https://example.com/tom.jpg"
        }
        response = client.post("/api/v1/actors/", json=actor_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["first_name"] == actor_data["first_name"]
        assert data["last_name"] == actor_data["last_name"]
        assert data["age"] == actor_data["age"]
        assert "id" in data

    def test_create_actor_without_optional_fields(self, client):
        actor_data = {
            "first_name": "Brad",
            "last_name": "Pitt"
        }
        response = client.post("/api/v1/actors/", json=actor_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["first_name"] == actor_data["first_name"]
        assert data["age"] is None

    def test_get_actor_by_id_success(self, client, sample_actor):
        response = client.get(f"/api/v1/actors/{sample_actor['id']}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_actor["id"]
        assert data["first_name"] == sample_actor["first_name"]

    def test_get_actor_by_id_not_found(self, client):
        response = client.get("/api/v1/actors/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Actor with id 999 not found" in response.json()["detail"]

    def test_update_actor_success(self, client, sample_actor):
        update_data = {
            "first_name": "Leo",
            "last_name": "DiCaprio",
            "age": 50,
            "image_url": "https://example.com/updated.jpg"
        }
        response = client.put(f"/api/v1/actors/{sample_actor['id']}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["first_name"] == update_data["first_name"]
        assert data["age"] == update_data["age"]

    def test_update_actor_not_found(self, client):
        update_data = {
            "first_name": "Test",
            "last_name": "Actor",
            "age": 30,
            "image_url": None
        }
        response = client.put("/api/v1/actors/999", json=update_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_actor_success(self, client, sample_actor):
        response = client.delete(f"/api/v1/actors/{sample_actor['id']}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        get_response = client.get(f"/api/v1/actors/{sample_actor['id']}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_actor_not_found(self, client):
        response = client.delete("/api/v1/actors/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_filter_actors_by_name(self, client, sample_actor):
        response = client.get("/api/v1/actors/", params={"name": "Leo"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["first_name"] == sample_actor["first_name"]

    def test_filter_actors_by_last_name(self, client, sample_actor):
        response = client.get("/api/v1/actors/", params={"name": "DiCaprio"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1

    def test_create_actor_validation_name_too_short(self, client):
        actor_data = {
            "first_name": "A",  # Less than 2 characters
            "last_name": "Test"
        }
        response = client.post("/api/v1/actors/", json=actor_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_actor_validation_invalid_age(self, client):
        actor_data = {
            "first_name": "Test",
            "last_name": "Actor",
            "age": 150  # Over 120
        }
        response = client.post("/api/v1/actors/", json=actor_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

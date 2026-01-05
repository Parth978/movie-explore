import pytest
from fastapi import status


class TestDirectorsEndpoints:

    def test_get_all_directors_empty(self, client):
        response = client.get("/api/v1/directors/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []

    def test_create_director_success(self, client):
        director_data = {
            "first_name": "Steven",
            "last_name": "Spielberg",
            "age": 77,
            "image_url": "https://example.com/spielberg.jpg"
        }
        response = client.post("/api/v1/directors/", json=director_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["first_name"] == director_data["first_name"]
        assert data["last_name"] == director_data["last_name"]
        assert data["age"] == director_data["age"]
        assert "id" in data

    def test_create_director_without_optional_fields(self, client):
        director_data = {
            "first_name": "Quentin",
            "last_name": "Tarantino"
        }
        response = client.post("/api/v1/directors/", json=director_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["first_name"] == director_data["first_name"]
        assert data["age"] is None

    def test_get_director_by_id_success(self, client, sample_director):
        response = client.get(f"/api/v1/directors/{sample_director['id']}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_director["id"]
        assert data["first_name"] == sample_director["first_name"]

    def test_get_director_by_id_not_found(self, client):
        response = client.get("/api/v1/directors/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Director with id 999 not found" in response.json()["detail"]

    def test_update_director_success(self, client, sample_director):
        update_data = {
            "first_name": "Chris",
            "last_name": "Nolan",
            "age": 55,
            "image_url": "https://example.com/updated.jpg"
        }
        response = client.put(f"/api/v1/directors/{sample_director['id']}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["first_name"] == update_data["first_name"]
        assert data["age"] == update_data["age"]

    def test_update_director_not_found(self, client):
        update_data = {
            "first_name": "Test",
            "last_name": "Director",
            "age": 50,
            "image_url": None
        }
        response = client.put("/api/v1/directors/999", json=update_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_director_success(self, client, sample_director):
        response = client.delete(f"/api/v1/directors/{sample_director['id']}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify deletion
        get_response = client.get(f"/api/v1/directors/{sample_director['id']}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_director_not_found(self, client):
        response = client.delete("/api/v1/directors/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_filter_directors_by_name(self, client, sample_director):
        response = client.get("/api/v1/directors/", params={"name": "Chris"})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["first_name"] == sample_director["first_name"]

    def test_create_director_validation_name_too_short(self, client):
        director_data = {
            "first_name": "A",  # Less than 2 characters
            "last_name": "Test"
        }
        response = client.post("/api/v1/directors/", json=director_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    def test_create_director_validation_invalid_age(self, client):
        director_data = {
            "first_name": "Test",
            "last_name": "Director",
            "age": 150  # Over 120
        }
        response = client.post("/api/v1/directors/", json=director_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

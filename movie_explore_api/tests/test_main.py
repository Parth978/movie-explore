import pytest
from fastapi import status


class TestMainEndpoints:
    """Tests for main application endpoints."""

    def test_root_endpoint(self, client):
        """Test the root endpoint returns hello message."""
        response = client.get("/")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == {"message": "Hello 👋"}

    def test_openapi_docs_available(self, client):
        """Test that OpenAPI docs are available."""
        response = client.get("/docs")
        
        assert response.status_code == status.HTTP_200_OK

    def test_openapi_json_available(self, client):
        """Test that OpenAPI JSON schema is available."""
        response = client.get("/openapi.json")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["info"]["title"] == "Movie Explore API"
        assert data["info"]["version"] == "1.0.0"

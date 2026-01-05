import pytest
from fastapi import status


class TestReviewsEndpoints:
   
    def test_get_all_reviews_empty(self, client):
        response = client.get("/api/v1/reviews/")
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []

    def test_create_review_success(self, client, sample_movie):
        review_data = {
            "movie_id": sample_movie["id"],
            "reviewer_name": "Jane Doe",
            "rating": 8.5,
            "comment": "Great movie!"
        }
        response = client.post("/api/v1/reviews/", json=review_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["movie_id"] == review_data["movie_id"]
        assert data["reviewer_name"] == review_data["reviewer_name"]
        assert data["rating"] == review_data["rating"]
        assert data["comment"] == review_data["comment"]
        assert "id" in data

    def test_create_review_invalid_movie(self, client):
        review_data = {
            "movie_id": 999,
            "reviewer_name": "Test User",
            "rating": 7.0,
            "comment": "Test comment"
        }
        response = client.post("/api/v1/reviews/", json=review_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Movie with id 999 not found" in response.json()["detail"]

    def test_get_review_by_id_success(self, client, sample_review):
        response = client.get(f"/api/v1/reviews/{sample_review['id']}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_review["id"]
        assert data["reviewer_name"] == sample_review["reviewer_name"]

    def test_get_review_by_id_not_found(self, client):
        response = client.get("/api/v1/reviews/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert "Review with id 999 not found" in response.json()["detail"]

    def test_update_review_success(self, client, sample_review):
        update_data = {
            "movie_id": sample_review["movie_id"],
            "reviewer_name": "Updated Reviewer",
            "rating": 10.0,
            "comment": "Changed my mind, it's perfect!"
        }
        response = client.put(f"/api/v1/reviews/{sample_review['id']}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["reviewer_name"] == update_data["reviewer_name"]
        assert data["rating"] == update_data["rating"]

    def test_update_review_not_found(self, client, sample_movie):
        update_data = {
            "movie_id": sample_movie["id"],
            "reviewer_name": "Test",
            "rating": 5.0,
            "comment": "Test"
        }
        response = client.put("/api/v1/reviews/999", json=update_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_review_success(self, client, sample_review):
        response = client.delete(f"/api/v1/reviews/{sample_review['id']}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        get_response = client.get(f"/api/v1/reviews/{sample_review['id']}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_review_not_found(self, client):
        response = client.delete("/api/v1/reviews/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_filter_reviews_by_movie_id(self, client, sample_review, sample_movie):
        response = client.get("/api/v1/reviews/", params={"movie_id": sample_movie["id"]})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["movie_id"] == sample_movie["id"]

    def test_filter_reviews_by_min_rating(self, client, sample_review):
        response = client.get("/api/v1/reviews/", params={"min_rating": 8.0})
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 1
        assert data[0]["rating"] >= 8.0

    def test_get_movie_average_rating(self, client, sample_movie):
        reviews = [
            {"movie_id": sample_movie["id"], "reviewer_name": "User1", "rating": 8.0, "comment": "Good"},
            {"movie_id": sample_movie["id"], "reviewer_name": "User2", "rating": 9.0, "comment": "Great"},
            {"movie_id": sample_movie["id"], "reviewer_name": "User3", "rating": 10.0, "comment": "Perfect"},
        ]
        for review in reviews:
            client.post("/api/v1/reviews/", json=review)
        
        response = client.get(f"/api/v1/reviews/movie/{sample_movie['id']}/average")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "average_rating" in data
        assert data["average_rating"] == 9.0  # (8+9+10)/3

    def test_get_movie_average_rating_movie_not_found(self, client):
        response = client.get("/api/v1/reviews/movie/999/average")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_create_multiple_reviews_for_movie(self, client, sample_movie):
        reviewers = ["Alice", "Bob", "Charlie"]
        
        for i, name in enumerate(reviewers):
            review_data = {
                "movie_id": sample_movie["id"],
                "reviewer_name": name,
                "rating": 7.0 + i,
                "comment": f"Review by {name}"
            }
            response = client.post("/api/v1/reviews/", json=review_data)
            assert response.status_code == status.HTTP_201_CREATED
        
        # Get reviews for this movie
        response = client.get("/api/v1/reviews/", params={"movie_id": sample_movie["id"]})
        assert len(response.json()) == 3

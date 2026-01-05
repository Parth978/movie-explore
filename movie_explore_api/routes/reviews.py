from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from database_models import Review, Movie
from models import ReviewBase, ReviewResponse

router = APIRouter(prefix="/api/v1/reviews", tags=["Reviews"])


@router.get('/', response_model=List[ReviewResponse])
def getAllReviews(
    movie_id: int | None = None,
    min_rating: float | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Review)
    if movie_id:
        query = query.filter(Review.movie_id == movie_id)
    if min_rating:
        query = query.filter(Review.rating >= min_rating)
    reviews = query.all()
    return reviews


@router.get('/{id}', response_model=ReviewResponse)
def getReviewById(id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review with id {id} not found"
        )
    return review


@router.post('/', response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def createReview(review: ReviewBase, db: Session = Depends(get_db)):
    # Verify movie exists
    movie = db.query(Movie).filter(Movie.id == review.movie_id).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Movie with id {review.movie_id} not found"
        )
    
    new_review = Review(
        movie_id=review.movie_id,
        reviewer_name=review.reviewer_name,
        rating=review.rating,
        comment=review.comment
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review


@router.put('/{id}', response_model=ReviewResponse)
def updateReview(id: int, review: ReviewBase, db: Session = Depends(get_db)):
    existing_review = db.query(Review).filter(Review.id == id).first()
    if not existing_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review with id {id} not found"
        )
    
    existing_review.reviewer_name = review.reviewer_name
    existing_review.rating = review.rating
    existing_review.comment = review.comment
    
    db.commit()
    db.refresh(existing_review)
    return existing_review


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def deleteReview(id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Review with id {id} not found"
        )
    
    db.delete(review)
    db.commit()
    return None


@router.get('/movie/{movie_id}/average')
def getMovieAverageRating(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Movie with id {movie_id} not found"
        )
    
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.movie_id == movie_id).scalar()
    review_count = db.query(func.count(Review.id)).filter(Review.movie_id == movie_id).scalar()
    
    return {
        "movie_id": movie_id,
        "movie_title": movie.title,
        "average_rating": round(avg_rating, 2) if avg_rating else None,
        "total_reviews": review_count
    }

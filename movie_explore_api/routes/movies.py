from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from database import get_db
from database_models import Movie, movie_genre, movie_actor, Genre, Actor, Director
from models import MovieBase, MovieResponse, MovieDetailResponse

router = APIRouter(prefix="/api/v1/movies", tags=["Movies"])


@router.get('/', response_model=List[MovieDetailResponse], status_code=status.HTTP_200_OK)
def getAllMovies(
    genre: str | None = None,
    actor: str | None = None,
    director: str | None = None,
    release_year: int | None = None,
    title: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Movie)

    if title:
        query = query.filter(Movie.title.ilike(f"%{title}%"))
    if genre:
        query = query.join(Movie.genres).filter(Genre.type == genre)
    if actor:
        query = query.join(Movie.actors).filter(
            (Actor.first_name.ilike(f"%{actor}%")) |
            (Actor.last_name.ilike(f"%{actor}%"))
        )
    if director:
        query = query.join(Movie.director).filter(
            (Director.first_name.ilike(f"%{director}%")) | 
            (Director.last_name.ilike(f"%{director}%"))
        )
    if release_year:
        query = query.filter(Movie.release_year == release_year)

    movie_ids = [m.id for m in query.all()]
    if movie_ids:
        movies = db.query(Movie).options(
            joinedload(Movie.director),
            joinedload(Movie.genres),
            joinedload(Movie.actors),
            joinedload(Movie.reviews)
        ).filter(Movie.id.in_(movie_ids)).all()
    else:
        movies = []
    
    return movies


@router.get('/{id}', response_model=MovieDetailResponse, status_code=status.HTTP_200_OK)
def getMovieById(id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).options(
        joinedload(Movie.director),
        joinedload(Movie.genres),
        joinedload(Movie.actors),
        joinedload(Movie.reviews)
    ).filter(Movie.id == id).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Movie with id {id} not found"
        )
    return movie


@router.post('/', response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
def createMovie(movie: MovieBase, db: Session = Depends(get_db)):
    director = db.query(Director).filter(Director.id == movie.director_id).first()
    if not director:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Director with id {movie.director_id} not found"
        )
    
    existing_movie = db.query(Movie).filter(Movie.title == movie.title).first()
    if existing_movie:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Movie with title '{movie.title}' already exists"
        )
    
    new_movie = Movie(
        title=movie.title,
        description=movie.description,
        release_year=movie.release_year,
        image_url=movie.image_url,
        director_id=movie.director_id,
        rating=movie.rating
    )
    db.add(new_movie)
    db.commit()
    db.refresh(new_movie)
    return new_movie


@router.put('/{id}', response_model=MovieResponse)
def updateMovie(id: int, movie: MovieBase, db: Session = Depends(get_db)):
    existing_movie = db.query(Movie).filter(Movie.id == id).first()
    if not existing_movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Movie with id {id} not found"
        )
    director = db.query(Director).filter(Director.id == movie.director_id).first()
    if not director:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Director with id {movie.director_id} not found"
        )
    
    existing_movie.title = movie.title
    existing_movie.description = movie.description
    existing_movie.release_year = movie.release_year
    existing_movie.image_url = movie.image_url
    existing_movie.director_id = movie.director_id
    existing_movie.rating = movie.rating
    
    db.commit()
    db.refresh(existing_movie)
    return existing_movie


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def deleteMovie(id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == id).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Movie with id {id} not found"
        )
    
    db.delete(movie)
    db.commit()
    return None
def deleteMovie(id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == id).first()
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Movie with id {id} not found"
        )
    
    db.delete(movie)
    db.commit()
    return None
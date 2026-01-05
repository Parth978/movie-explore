from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from database_models import Genre
from models import GenreBase, GenreResponse

router = APIRouter(prefix="/api/v1/genres", tags=["Genres"])


@router.get('/', response_model=List[GenreResponse])
def getAllGenres(db: Session = Depends(get_db)):
    genres = db.query(Genre).all()
    return genres


@router.get('/{id}', response_model=GenreResponse)
def getGenreById(id: int, db: Session = Depends(get_db)):
    genre = db.query(Genre).filter(Genre.id == id).first()
    if not genre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Genre with id {id} not found"
        )
    return genre


@router.post('/', response_model=GenreResponse, status_code=status.HTTP_201_CREATED)
def createGenre(genre: GenreBase, db: Session = Depends(get_db)):
    existing_genre = db.query(Genre).filter(Genre.type == genre.type).first()
    if existing_genre:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Genre '{genre.type}' already exists"
        )
    
    new_genre = Genre(type=genre.type)
    db.add(new_genre)
    db.commit()
    db.refresh(new_genre)
    return new_genre


@router.put('/{id}', response_model=GenreResponse)
def updateGenre(id: int, genre: GenreBase, db: Session = Depends(get_db)):
    existing_genre = db.query(Genre).filter(Genre.id == id).first()
    if not existing_genre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Genre with id {id} not found"
        )
    
    existing_genre.type = genre.type
    
    db.commit()
    db.refresh(existing_genre)
    return existing_genre


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def deleteGenre(id: int, db: Session = Depends(get_db)):
    genre = db.query(Genre).filter(Genre.id == id).first()
    if not genre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Genre with id {id} not found"
        )
    
    db.delete(genre)
    db.commit()
    return None

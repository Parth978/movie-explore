from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from database import get_db
from database_models import Director
from models import DirectorBase, DirectorResponse, DirectorDetailResponse

router = APIRouter(prefix="/api/v1/directors", tags=["Directors"])


@router.get('/', response_model=List[DirectorDetailResponse])
def getAllDirectors(
    db: Session = Depends(get_db),
    name: str | None = None
):
    query = db.query(Director).options(joinedload(Director.movies))
    if name:
        query = query.filter(
            (Director.first_name.ilike(f"%{name}%")) |
            (Director.last_name.ilike(f"%{name}%"))
        )
    directors = query.all()
    return directors


@router.get('/{id}', response_model=DirectorDetailResponse)
def getDirectorById(id: int, db: Session = Depends(get_db)):
    director = db.query(Director).options(joinedload(Director.movies)).filter(Director.id == id).first()
    if not director:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Director with id {id} not found"
        )
    return director


@router.post('/', response_model=DirectorResponse, status_code=status.HTTP_201_CREATED)
def createDirector(director: DirectorBase, db: Session = Depends(get_db)):
    new_director = Director(
        first_name=director.first_name,
        last_name=director.last_name,
        age=director.age,
        image_url=director.image_url
    )
    db.add(new_director)
    db.commit()
    db.refresh(new_director)
    return new_director


@router.put('/{id}', response_model=DirectorResponse)
def updateDirector(id: int, director: DirectorBase, db: Session = Depends(get_db)):
    existing_director = db.query(Director).filter(Director.id == id).first()
    if not existing_director:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Director with id {id} not found"
        )
    
    existing_director.first_name = director.first_name
    existing_director.last_name = director.last_name
    existing_director.age = director.age
    existing_director.image_url = director.image_url
    
    db.commit()
    db.refresh(existing_director)
    return existing_director


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def deleteDirector(id: int, db: Session = Depends(get_db)):
    director = db.query(Director).filter(Director.id == id).first()
    if not director:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Director with id {id} not found"
        )
    
    db.delete(director)
    db.commit()
    return None

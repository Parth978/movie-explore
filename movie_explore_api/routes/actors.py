from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from database import get_db
from database_models import Actor, Movie, Genre
from models import ActorBase, ActorResponse, ActorDetailResponse

router = APIRouter(prefix="/api/v1/actors", tags=["Actors"])


@router.get('/', response_model=List[ActorDetailResponse])
def getAllActors(
    db: Session = Depends(get_db),
    movie: str | None = None,
    genre: str | None = None,
    name: str | None = None
):
    query = db.query(Actor).options(joinedload(Actor.movies))
    if name:
        query = query.filter(
            (Actor.first_name.ilike(f"%{name}%")) |
            (Actor.last_name.ilike(f"%{name}%"))
        )
    if movie:
        query = query.join(Actor.movies).filter(Movie.title.ilike(f"%{movie}%"))
    if genre:
        query = query.join(Actor.movies).join(Movie.genres).filter(Genre.type == genre)
    actors = query.all()
    return actors


@router.get('/{id}', response_model=ActorDetailResponse)
def getActorById(id: int, db: Session = Depends(get_db)):
    actor = db.query(Actor).options(joinedload(Actor.movies)).filter(Actor.id == id).first()
    if not actor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Actor with id {id} not found"
        )
    return actor


@router.post('/', response_model=ActorResponse, status_code=status.HTTP_201_CREATED)
def createActor(actor: ActorBase, db: Session = Depends(get_db)):
    new_actor = Actor(
        first_name=actor.first_name,
        last_name=actor.last_name,
        age=actor.age,
        image_url=actor.image_url
    )
    db.add(new_actor)
    db.commit()
    db.refresh(new_actor)
    return new_actor


@router.put('/{id}', response_model=ActorResponse)
def updateActor(id: int, actor: ActorBase, db: Session = Depends(get_db)):
    existing_actor = db.query(Actor).filter(Actor.id == id).first()
    if not existing_actor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Actor with id {id} not found"
        )
    
    existing_actor.first_name = actor.first_name
    existing_actor.last_name = actor.last_name
    existing_actor.age = actor.age
    existing_actor.image_url = actor.image_url
    
    db.commit()
    db.refresh(existing_actor)
    return existing_actor


@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def deleteActor(id: int, db: Session = Depends(get_db)):
    actor = db.query(Actor).filter(Actor.id == id).first()
    if not actor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Actor with id {id} not found"
        )
    
    db.delete(actor)
    db.commit()
    return None
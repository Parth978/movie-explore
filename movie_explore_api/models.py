from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


# Movie models
class MovieBase(BaseModel):
    title: str = Field(min_length=3, max_length=50)
    description: str
    release_year: int = Field(ge=1900, le=2026)
    image_url: Optional[str] = None
    director_id: int
    rating: Optional[float] = None


class MovieResponse(BaseModel):
    id: int
    title: str
    description: str
    release_year: int
    image_url: Optional[str] = None
    director_id: int
    rating: Optional[float] = None

    class Config:
        from_attributes = True


class MovieDetailResponse(BaseModel):
    id: int
    title: str
    description: str
    release_year: int
    image_url: Optional[str] = None
    director_id: int
    rating: Optional[float] = None
    director: Optional["DirectorResponse"] = None
    genres: List["GenreResponse"] = []
    actors: List["ActorResponse"] = []
    reviews: List["ReviewResponse"] = []

    class Config:
        from_attributes = True


# Genre models
class GenreBase(BaseModel):
    type: str = Field(min_length=2, max_length=30)


class GenreResponse(BaseModel):
    id: int
    type: str

    class Config:
        from_attributes = True


# Actor models
class ActorBase(BaseModel):
    first_name: str = Field(min_length=2, max_length=50)
    last_name: str = Field(min_length=2, max_length=50)
    age: Optional[int] = Field(default=None, ge=1, le=120)
    image_url: Optional[str] = None


class ActorResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    age: Optional[int] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class ActorDetailResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    age: Optional[int] = None
    image_url: Optional[str] = None
    movies: List["MovieResponse"] = []

    class Config:
        from_attributes = True


# Director models
class DirectorBase(BaseModel):
    first_name: str = Field(min_length=2, max_length=50)
    last_name: str = Field(min_length=2, max_length=50)
    age: Optional[int] = Field(default=None, ge=1, le=120)
    image_url: Optional[str] = None


class DirectorResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    age: Optional[int] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class DirectorDetailResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    age: Optional[int] = None
    image_url: Optional[str] = None
    movies: List["MovieResponse"] = []

    class Config:
        from_attributes = True


# Review models
class ReviewBase(BaseModel):
    movie_id: int
    reviewer_name: str = Field(min_length=2, max_length=100)
    rating: float = Field(ge=1.0, le=10.0)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    movie_id: int
    reviewer_name: str
    rating: float
    comment: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

    class Config:
        from_attributes = True
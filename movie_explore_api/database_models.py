from database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table, Text, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

movie_actor =  Table(
    "movie_actor",
    Base.metadata,
    Column("movie_id", Integer, ForeignKey("movies.id"), primary_key=True),
    Column("actor_id", Integer, ForeignKey("actors.id"), primary_key=True)
)

movie_genre = Table(
    "movie_genre",
    Base.metadata,
    Column("movie_id", Integer, ForeignKey("movies.id"), primary_key=True),
    Column("genre_id", Integer, ForeignKey("genres.id"), primary_key=True)
)

class Movie(Base):
    __tablename__ = "movies"
    id= Column(Integer,primary_key= True, index= True)
    title= Column(String(50), unique= True)
    description= Column(String(500))
    release_year= Column(Integer)
    image_url= Column(String(500))
    director_id= Column(Integer, ForeignKey("directors.id"))
    rating= Column(Integer)
    director = relationship("Director", back_populates="movies")
    genres = relationship("Genre", secondary=movie_genre, back_populates="movies")  
    actors = relationship("Actor", secondary=movie_actor, back_populates="movies")
    reviews = relationship("Review", back_populates="movie")  


class Genre(Base):
    __tablename__ = "genres"
    id= Column(Integer, primary_key=True, index=True)
    type= Column(String(30))
    movies= relationship('Movie', secondary=movie_genre, back_populates="genres")


class Actor(Base):
    __tablename__ = "actors"
    id= Column(Integer, primary_key= True, index= True)
    first_name= Column(String(50))
    last_name= Column(String(50))
    age= Column(Integer)
    image_url = Column(String(500))
    movies = relationship('Movie', secondary=movie_actor, back_populates="actors")


class Director(Base):
    __tablename__= "directors"
    id= Column(Integer, primary_key= True, index= True)
    first_name= Column(String(50))
    last_name= Column(String(50))
    age= Column(Integer)
    image_url = Column(String(500))
    movies= relationship("Movie", back_populates="director")


class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=False)
    reviewer_name = Column(String(100), nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    movie = relationship("Movie", back_populates="reviews")
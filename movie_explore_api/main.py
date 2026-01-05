from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import movies, actors, genres, directors, reviews
from database import engine
import database_models

app = FastAPI(title="Movie Explore API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database_models.Base.metadata.create_all(bind=engine)

app.include_router(movies.router)
app.include_router(actors.router)
app.include_router(genres.router)
app.include_router(directors.router)
app.include_router(reviews.router)
 
@app.get("/")
def fetchAllRequest():
    return { "message" : "Hello 👋"}
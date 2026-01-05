export interface Person {
    id: number;
    first_name: string;
    last_name: string;
    age: number;
    image_url: number | null;
}

export interface PersonWithMovies extends Person {
    movies: Movie[];
}

export interface Genre {
    id: number;
    type: string;
}

export interface Movie {
    id: number;
    title: string;
    description: string;
    release_year: number;
    image_url: string| null;
    director_d: number;
    director: Person;
    actors: Person[];
    genres: Genre[];
    rating: number;
    reviews: Review[];
}

export interface Review {
    id: number;
    movie_id: number;
    reviewer_name: string;
    rating: number;
    comment: string;
    created_at: string;
}
import type { Movie, Genre, Person, Review, PersonWithMovies } from '../../types';

export const mockGenres: Genre[] = [
  { id: 1, type: 'Action' },
  { id: 2, type: 'Comedy' },
  { id: 3, type: 'Drama' },
  { id: 4, type: 'Horror' },
  { id: 5, type: 'Sci-Fi' },
];

export const mockPerson: Person = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  age: 45,
  image_url: null,
};

export const mockDirector: Person = {
  id: 2,
  first_name: 'Jane',
  last_name: 'Smith',
  age: 50,
  image_url: null,
};

export const mockActors: Person[] = [
  { id: 3, first_name: 'Tom', last_name: 'Hanks', age: 67, image_url: null },
  { id: 4, first_name: 'Emma', last_name: 'Stone', age: 35, image_url: null },
  { id: 5, first_name: 'Ryan', last_name: 'Gosling', age: 43, image_url: null },
];

export const mockReviews: Review[] = [
  {
    id: 1,
    movie_id: 1,
    reviewer_name: 'Movie Critic',
    rating: 4,
    comment: 'Great movie with amazing performances!',
    created_at: '2025-12-01T10:00:00Z',
  },
  {
    id: 2,
    movie_id: 1,
    reviewer_name: 'Film Enthusiast',
    rating: 5,
    comment: 'A masterpiece of modern cinema.',
    created_at: '2025-12-15T14:30:00Z',
  },
];

export const mockMovie: Movie = {
  id: 1,
  title: 'The Great Adventure',
  description: 'An epic journey through time and space.',
  release_year: 2025,
  image_url: 'https://example.com/movie1.jpg',
  director_d: 2,
  director: mockDirector,
  actors: mockActors,
  genres: [mockGenres[0], mockGenres[4]],
  rating: 85,
  reviews: mockReviews,
};

export const mockMovies: Movie[] = [
  mockMovie,
  {
    id: 2,
    title: 'Comedy Gold',
    description: 'A hilarious comedy for all ages.',
    release_year: 2024,
    image_url: 'https://example.com/movie2.jpg',
    director_d: 2,
    director: mockDirector,
    actors: mockActors.slice(0, 2),
    genres: [mockGenres[1]],
    rating: 72,
    reviews: [],
  },
  {
    id: 3,
    title: 'Dark Drama',
    description: 'A gripping drama about life and loss.',
    release_year: 2023,
    image_url: null,
    director_d: 2,
    director: mockDirector,
    actors: mockActors.slice(1),
    genres: [mockGenres[2]],
    rating: 90,
    reviews: mockReviews.slice(0, 1),
  },
];

export const mockPersonWithMovies: PersonWithMovies = {
  ...mockDirector,
  movies: mockMovies,
};

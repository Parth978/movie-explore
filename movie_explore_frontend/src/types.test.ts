/**
 * @fileoverview Tests for TypeScript type definitions
 * 
 * What is being tested:
 * - Type definitions for Movie, Person, Genre, Review, and PersonWithMovies
 * 
 * Main scenarios covered:
 * - Type shapes are correctly defined
 * - Required and optional properties work as expected
 * - Type relationships (e.g., Movie contains Person, Genre arrays)
 */

import { describe, it, expect } from 'vitest';
import type { Movie, Person, Genre, Review, PersonWithMovies } from './types';

describe('TypeScript Types', () => {
  describe('Genre type', () => {
    it('accepts valid Genre objects', () => {
      const genre: Genre = {
        id: 1,
        type: 'Action',
      };
      
      expect(genre.id).toBe(1);
      expect(genre.type).toBe('Action');
    });
  });

  describe('Person type', () => {
    it('accepts valid Person objects', () => {
      const person: Person = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        age: 45,
        image_url: null,
      };
      
      expect(person.id).toBe(1);
      expect(person.first_name).toBe('John');
      expect(person.last_name).toBe('Doe');
      expect(person.age).toBe(45);
      expect(person.image_url).toBeNull();
    });

    it('accepts Person with image_url as number', () => {
      const person: Person = {
        id: 1,
        first_name: 'Jane',
        last_name: 'Smith',
        age: 35,
        image_url: 12345,
      };
      
      expect(person.image_url).toBe(12345);
    });
  });

  describe('Review type', () => {
    it('accepts valid Review objects', () => {
      const review: Review = {
        id: 1,
        movie_id: 1,
        reviewer_name: 'Film Critic',
        rating: 4,
        comment: 'Great movie!',
        created_at: '2025-12-01T10:00:00Z',
      };
      
      expect(review.id).toBe(1);
      expect(review.movie_id).toBe(1);
      expect(review.reviewer_name).toBe('Film Critic');
      expect(review.rating).toBe(4);
      expect(review.comment).toBe('Great movie!');
      expect(review.created_at).toBe('2025-12-01T10:00:00Z');
    });
  });

  describe('Movie type', () => {
    it('accepts valid Movie objects', () => {
      const director: Person = {
        id: 1,
        first_name: 'Steven',
        last_name: 'Spielberg',
        age: 77,
        image_url: null,
      };
      
      const actors: Person[] = [
        {
          id: 2,
          first_name: 'Tom',
          last_name: 'Hanks',
          age: 67,
          image_url: null,
        },
      ];
      
      const genres: Genre[] = [{ id: 1, type: 'Drama' }];
      
      const reviews: Review[] = [
        {
          id: 1,
          movie_id: 1,
          reviewer_name: 'Critic',
          rating: 5,
          comment: 'Masterpiece',
          created_at: '2025-01-01T00:00:00Z',
        },
      ];
      
      const movie: Movie = {
        id: 1,
        title: 'Saving Private Ryan',
        description: 'A war drama film.',
        release_year: 1998,
        image_url: 'https://example.com/movie.jpg',
        director_d: 1,
        director,
        actors,
        genres,
        rating: 94,
        reviews,
      };
      
      expect(movie.id).toBe(1);
      expect(movie.title).toBe('Saving Private Ryan');
      expect(movie.description).toBe('A war drama film.');
      expect(movie.release_year).toBe(1998);
      expect(movie.image_url).toBe('https://example.com/movie.jpg');
      expect(movie.director_d).toBe(1);
      expect(movie.director).toEqual(director);
      expect(movie.actors).toEqual(actors);
      expect(movie.genres).toEqual(genres);
      expect(movie.rating).toBe(94);
      expect(movie.reviews).toEqual(reviews);
    });

    it('supports movies with multiple genres and actors', () => {
      const movie: Movie = {
        id: 1,
        title: 'Test Movie',
        description: 'Test description',
        release_year: 2025,
        image_url: 'https://example.com/test.jpg',
        director_d: 1,
        director: {
          id: 1,
          first_name: 'Director',
          last_name: 'Name',
          age: 50,
          image_url: null,
        },
        actors: [
          { id: 1, first_name: 'Actor', last_name: 'One', age: 30, image_url: null },
          { id: 2, first_name: 'Actor', last_name: 'Two', age: 25, image_url: null },
          { id: 3, first_name: 'Actor', last_name: 'Three', age: 40, image_url: null },
        ],
        genres: [
          { id: 1, type: 'Action' },
          { id: 2, type: 'Comedy' },
          { id: 3, type: 'Drama' },
        ],
        rating: 80,
        reviews: [],
      };
      
      expect(movie.actors.length).toBe(3);
      expect(movie.genres.length).toBe(3);
    });
  });

  describe('PersonWithMovies type', () => {
    it('extends Person with movies array', () => {
      const personWithMovies: PersonWithMovies = {
        id: 1,
        first_name: 'Tom',
        last_name: 'Hanks',
        age: 67,
        image_url: null,
        movies: [
          {
            id: 1,
            title: 'Forrest Gump',
            description: 'Life is like a box of chocolates.',
            release_year: 1994,
            image_url: 'https://example.com/fg.jpg',
            director_d: 1,
            director: {
              id: 2,
              first_name: 'Robert',
              last_name: 'Zemeckis',
              age: 72,
              image_url: null,
            },
            actors: [],
            genres: [{ id: 1, type: 'Drama' }],
            rating: 88,
            reviews: [],
          },
        ],
      };
      
      expect(personWithMovies.id).toBe(1);
      expect(personWithMovies.first_name).toBe('Tom');
      expect(personWithMovies.movies.length).toBe(1);
      expect(personWithMovies.movies[0].title).toBe('Forrest Gump');
    });

    it('supports empty movies array', () => {
      const personWithMovies: PersonWithMovies = {
        id: 1,
        first_name: 'New',
        last_name: 'Actor',
        age: 25,
        image_url: null,
        movies: [],
      };
      
      expect(personWithMovies.movies.length).toBe(0);
    });
  });
});

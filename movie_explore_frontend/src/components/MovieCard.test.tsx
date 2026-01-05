/**
 * @fileoverview Tests for MovieCard component
 * 
 * What is being tested:
 * - MovieCard component that displays movie information in a card format
 * 
 * Main scenarios covered:
 * - Renders without crashing
 * - Displays movie title
 * - Displays release year
 * - Displays rating (converted from 0-100 to 0-10 scale)
 * - Displays up to 2 genres
 * - Shows fallback image when image_url is null
 * - Contains a link to the movie details page
 * - Handles movies with no genres gracefully
 */

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MovieCard } from './MovieCard';
import { renderWithRouter } from '../test/utils/renderWithRouter';
import { mockMovie, mockMovies } from '../test/mocks/mockData';
import type { Movie } from '../types';

describe('MovieCard', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithRouter(<MovieCard movie={mockMovie} />);
      
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('displays the movie title', () => {
      renderWithRouter(<MovieCard movie={mockMovie} />);
      
      expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
    });

    it('displays the release year', () => {
      renderWithRouter(<MovieCard movie={mockMovie} />);
      
      expect(screen.getByText('2025')).toBeInTheDocument();
    });

    it('displays the rating converted to 10-point scale', () => {
      renderWithRouter(<MovieCard movie={mockMovie} />);
      
      // Rating is 85, displayed as 85/10 = 8.5
      expect(screen.getByText('8.5')).toBeInTheDocument();
    });

    it('displays up to 2 genres', () => {
      renderWithRouter(<MovieCard movie={mockMovie} />);
      
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    });

    it('limits displayed genres to 2 even when more are available', () => {
      const movieWithManyGenres: Movie = {
        ...mockMovie,
        genres: [
          { id: 1, type: 'Action' },
          { id: 2, type: 'Comedy' },
          { id: 3, type: 'Drama' },
          { id: 4, type: 'Horror' },
        ],
      };
      renderWithRouter(<MovieCard movie={movieWithManyGenres} />);
      
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Comedy')).toBeInTheDocument();
      expect(screen.queryByText('Drama')).not.toBeInTheDocument();
      expect(screen.queryByText('Horror')).not.toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('displays the movie image when available', () => {
      renderWithRouter(<MovieCard movie={mockMovie} />);
      
      const img = screen.getByRole('img', { name: 'The Great Adventure' });
      expect(img).toHaveAttribute('src', 'https://example.com/movie1.jpg');
    });

    it('displays fallback image when image_url is null', () => {
      const movieWithoutImage: Movie = {
        ...mockMovie,
        image_url: null as unknown as string,
      };
      renderWithRouter(<MovieCard movie={movieWithoutImage} />);
      
      const img = screen.getByRole('img', { name: 'The Great Adventure' });
      expect(img.getAttribute('src')).toContain('play-lh.googleusercontent.com');
    });

    it('has correct alt text for the image', () => {
      renderWithRouter(<MovieCard movie={mockMovie} />);
      
      expect(
        screen.getByRole('img', { name: 'The Great Adventure' })
      ).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('contains a link to the movie details page', () => {
      renderWithRouter(<MovieCard movie={mockMovie} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/movie/1');
    });

    it('generates correct link for different movie IDs', () => {
      renderWithRouter(<MovieCard movie={mockMovies[1]} />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/movie/2');
    });

    it('link is clickable', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MovieCard movie={mockMovie} />);
      
      const link = screen.getByRole('link');
      await user.click(link);
      
      // Component should still render after click
      expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles movies with no genres', () => {
      const movieWithoutGenres: Movie = {
        ...mockMovie,
        genres: undefined as unknown as Movie['genres'],
      };
      renderWithRouter(<MovieCard movie={movieWithoutGenres} />);
      
      // Should still render the card without crashing
      expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
    });

    it('handles movies with empty genres array', () => {
      const movieWithEmptyGenres: Movie = {
        ...mockMovie,
        genres: [],
      };
      renderWithRouter(<MovieCard movie={movieWithEmptyGenres} />);
      
      expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
    });

    it('handles very long movie titles', () => {
      const movieWithLongTitle: Movie = {
        ...mockMovie,
        title:
          'This Is An Extremely Long Movie Title That Should Be Truncated By CSS',
      };
      renderWithRouter(<MovieCard movie={movieWithLongTitle} />);
      
      expect(
        screen.getByText(
          'This Is An Extremely Long Movie Title That Should Be Truncated By CSS'
        )
      ).toBeInTheDocument();
    });

    it('handles rating edge cases (0 rating)', () => {
      const movieWithZeroRating: Movie = {
        ...mockMovie,
        rating: 0,
      };
      renderWithRouter(<MovieCard movie={movieWithZeroRating} />);
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles rating edge cases (100 rating)', () => {
      const movieWithMaxRating: Movie = {
        ...mockMovie,
        rating: 100,
      };
      renderWithRouter(<MovieCard movie={movieWithMaxRating} />);
      
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });
});

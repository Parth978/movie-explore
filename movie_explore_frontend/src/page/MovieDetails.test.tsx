/**
 * @fileoverview Tests for MovieDetail page component
 * 
 * What is being tested:
 * - Movie details page showing full movie information
 * 
 * Main scenarios covered:
 * - Renders without crashing
 * - Shows loading state while fetching movie details
 * - Displays movie title and description
 * - Shows release year with calendar icon
 * - Displays all genres
 * - Shows director information with link
 * - Displays cast members with links to profiles
 * - Shows reviews when available
 * - Handles error state with back to home link
 * - Shows "Movie not found" for missing movie
 * - Contains back navigation link
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MovieDetail } from './MovieDetails';
import { apiClient } from '../api/client';
import { mockMovie, mockReviews } from '../test/mocks/mockData';

// Mock the API client
vi.mock('../api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockedApiClient = vi.mocked(apiClient);

const renderMovieDetail = (movieId = '1') => {
  return render(
    <MemoryRouter initialEntries={[`/movie/${movieId}`]}>
      <Routes>
        <Route path="/movie/:movieId" element={<MovieDetail />} />
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/person/:personId" element={<div>Person Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('MovieDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful responses
    mockedApiClient.get.mockImplementation((url: string) => {
      if (url.match(/^\/movies\/\d+$/)) {
        return Promise.resolve({ data: mockMovie });
      }
      if (url.match(/^\/reviews\/\?movieId=\d+$/)) {
        return Promise.resolve({ data: mockReviews });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner while fetching data', async () => {
      mockedApiClient.get.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockMovie }), 100))
      );
      
      renderMovieDetail();
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('hides loading spinner after data loads', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).not.toBeInTheDocument();
      });
    });
  });

  describe('Movie Information Display', () => {
    it('displays the movie title', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'The Great Adventure', level: 1 })
        ).toBeInTheDocument();
      });
    });

    it('displays the movie description', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(
          screen.getByText('An epic journey through time and space.')
        ).toBeInTheDocument();
      });
    });

    it('displays the release year', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByText('2025')).toBeInTheDocument();
      });
    });

    it('displays all movie genres', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
      });
    });
  });

  describe('Director Section', () => {
    it('displays director heading', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Director', level: 2 })
        ).toBeInTheDocument();
      });
    });

    it('displays director name', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('displays director age', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByText('50')).toBeInTheDocument();
      });
    });

    it('links to director profile', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        const directorLink = screen.getByRole('link', { name: /Jane Smith/i });
        expect(directorLink).toHaveAttribute(
          'href',
          '/person/2?type=directors'
        );
      });
    });
  });

  describe('Cast Section', () => {
    it('displays cast heading', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Cast', level: 2 })
        ).toBeInTheDocument();
      });
    });

    it('displays all cast members', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByText('Tom Hanks')).toBeInTheDocument();
        expect(screen.getByText('Emma Stone')).toBeInTheDocument();
        expect(screen.getByText('Ryan Gosling')).toBeInTheDocument();
      });
    });

    it('links to actor profiles', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        const actorLinks = screen.getAllByRole('link', { name: /Hanks|Stone|Gosling/i });
        expect(actorLinks[0]).toHaveAttribute('href', '/person/3?type=actors');
        expect(actorLinks[1]).toHaveAttribute('href', '/person/4?type=actors');
        expect(actorLinks[2]).toHaveAttribute('href', '/person/5?type=actors');
      });
    });
  });

  describe('Reviews Section', () => {
    it('displays reviews heading when reviews exist', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Reviews', level: 2 })
        ).toBeInTheDocument();
      });
    });

    it('displays review content', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(
          screen.getByText('Great movie with amazing performances!')
        ).toBeInTheDocument();
        expect(
          screen.getByText('A masterpiece of modern cinema.')
        ).toBeInTheDocument();
      });
    });

    it('displays reviewer names', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByText('Movie Critic')).toBeInTheDocument();
        expect(screen.getByText('Film Enthusiast')).toBeInTheDocument();
      });
    });

    it('displays review ratings', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByText('4/5')).toBeInTheDocument();
        expect(screen.getByText('5/5')).toBeInTheDocument();
      });
    });

    it('does not show reviews section when no reviews', async () => {
      mockedApiClient.get.mockImplementation((url: string) => {
        if (url.match(/^\/movies\/\d+$/)) {
          return Promise.resolve({ data: mockMovie });
        }
        if (url.match(/^\/reviews\/\?movieId=\d+$/)) {
          return Promise.resolve({ data: [] });
        }
        return Promise.reject(new Error('Unknown endpoint'));
      });
      
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
      });
      
      expect(
        screen.queryByRole('heading', { name: 'Reviews' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API fails', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('API Error'));
      
      renderMovieDetail();
      
      await waitFor(() => {
        expect(
          screen.getByText('Failed to load movie details. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('displays back to home link on error', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('API Error'));
      
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
          'href',
          '/'
        );
      });
    });
  });

  describe('Movie Not Found', () => {
    it('displays "Movie not found" when movie is null', async () => {
      mockedApiClient.get.mockImplementation((url: string) => {
        if (url.match(/^\/movies\/\d+$/)) {
          return Promise.resolve({ data: null });
        }
        if (url.match(/^\/reviews\/\?movieId=\d+$/)) {
          return Promise.resolve({ data: [] });
        }
        return Promise.reject(new Error('Unknown endpoint'));
      });
      
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByText('Movie not found')).toBeInTheDocument();
      });
    });

    it('displays back to home link when movie not found', async () => {
      mockedApiClient.get.mockImplementation((url: string) => {
        if (url.match(/^\/movies\/\d+$/)) {
          return Promise.resolve({ data: null });
        }
        return Promise.resolve({ data: [] });
      });
      
      renderMovieDetail();
      
      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
          'href',
          '/'
        );
      });
    });
  });

  describe('Navigation', () => {
    it('displays back to movies link', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: '← Back to Movies' })
        ).toHaveAttribute('href', '/');
      });
    });
  });

  describe('API Integration', () => {
    it('fetches movie details with correct ID', async () => {
      renderMovieDetail('123');
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/movies/123');
      });
    });

    it('fetches reviews with correct movie ID', async () => {
      renderMovieDetail('123');
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/reviews/?movieId=123');
      });
    });

    it('fetches both movie and reviews in parallel', async () => {
      renderMovieDetail();
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledTimes(2);
      });
    });
  });
});

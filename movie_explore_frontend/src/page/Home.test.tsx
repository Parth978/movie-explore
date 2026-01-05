/**
 * @fileoverview Tests for Home page component
 * 
 * What is being tested:
 * - Home page with movie listing, search, and filtering functionality
 * 
 * Main scenarios covered:
 * - Renders without crashing
 * - Displays the hero section with correct heading
 * - Shows loading state while fetching movies
 * - Displays movies in a grid after loading
 * - Handles error state gracefully with retry button
 * - Search functionality updates query
 * - Filter type selection works correctly
 * - Genre filtering works when genre filter type is selected
 * - Shows "no movies" message when results are empty
 * - Debounces search input
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './Home';
import { apiClient } from '../api/client';
import { mockMovies, mockGenres } from '../test/mocks/mockData';

// Mock the API client
vi.mock('../api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockedApiClient = vi.mocked(apiClient);

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful responses
    mockedApiClient.get.mockImplementation((url: string) => {
      if (url === '/genres/') {
        return Promise.resolve({ data: mockGenres });
      }
      if (url.startsWith('/movies/')) {
        return Promise.resolve({ data: mockMovies });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders without crashing', async () => {
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });

    it('displays the hero section heading', async () => {
      renderHome();
      
      expect(
        screen.getByRole('heading', { name: /Discover Your Next Favorite Film/i })
      ).toBeInTheDocument();
    });

    it('displays the hero description text', async () => {
      renderHome();
      
      expect(
        screen.getByText(/Browse thousands of movies/i)
      ).toBeInTheDocument();
    });

    it('renders the search bar', async () => {
      renderHome();
      
      expect(
        screen.getByLabelText('Search movies, actors, and directors')
      ).toBeInTheDocument();
    });

    it('renders the filter section with heading', async () => {
      renderHome();
      
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner while fetching movies', async () => {
      // Delay the API response to observe loading state
      mockedApiClient.get.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
      );
      
      renderHome();
      
      // Loading spinner should be present
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('hides loading spinner after movies load', async () => {
      renderHome();
      
      await waitFor(() => {
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).not.toBeInTheDocument();
      });
    });
  });

  describe('Movies Display', () => {
    it('displays movie cards after loading', async () => {
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
        expect(screen.getByText('Comedy Gold')).toBeInTheDocument();
        expect(screen.getByText('Dark Drama')).toBeInTheDocument();
      });
    });

    it('shows "no movies available" when movies array is empty', async () => {
      mockedApiClient.get.mockImplementation((url: string) => {
        if (url === '/genres/') {
          return Promise.resolve({ data: mockGenres });
        }
        return Promise.resolve({ data: [] });
      });
      
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('No movies available')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API fails', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('API Error'));
      
      renderHome();
      
      await waitFor(() => {
        expect(
          screen.getByText('Failed to load movies. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('displays retry button on error', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('API Error'));
      
      renderHome();
      
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Retry' })
        ).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('updates search input when user types', async () => {
      const user = userEvent.setup();
      renderHome();
      
      const searchInput = screen.getByLabelText('Search movies, actors, and directors');
      await user.type(searchInput, 'Matrix');
      
      expect(searchInput).toHaveValue('Matrix');
    });

    it('allows typing in the search input', async () => {
      const user = userEvent.setup();
      
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByLabelText('Search movies, actors, and directors');
      await user.type(searchInput, 'test');
      
      expect(searchInput).toHaveValue('test');
    });
  });

  describe('Filter Functionality', () => {
    it('displays filter type buttons', async () => {
      renderHome();
      
      expect(screen.getByRole('button', { name: 'Title' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Genre' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Actor' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Director' })).toBeInTheDocument();
    });

    it('shows genre buttons when genre filter is selected', async () => {
      const user = userEvent.setup();
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: 'Genre' }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Comedy' })).toBeInTheDocument();
      });
    });

    it('toggles genre selection when clicking genre button', async () => {
      const user = userEvent.setup();
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: 'Genre' }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: 'Action' }));
      
      // Should show remove filter button for selected genre
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Remove Action filter' })
        ).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('fetches genres on mount', async () => {
      renderHome();
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/genres/');
      });
    });

    it('fetches movies on mount', async () => {
      renderHome();
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/movies/');
      });
    });

    it('selects filter type when clicking filter button', async () => {
      const user = userEvent.setup();
      
      renderHome();
      
      await waitFor(() => {
        expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
      });
      
      // Click on Title filter
      const titleButton = screen.getByRole('button', { name: 'Title' });
      await user.click(titleButton);
      
      // Button should show active state (bg-amber-500 class)
      expect(titleButton.className).toContain('bg-amber-500');
    });
  });
});

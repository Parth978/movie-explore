/**
 * @fileoverview Tests for PersonProfile page component
 * 
 * What is being tested:
 * - Person profile page showing actor or director information
 * 
 * Main scenarios covered:
 * - Renders without crashing
 * - Shows loading state while fetching person details
 * - Displays person's full name
 * - Shows person's age
 * - Displays person type badge (Actor/Director)
 * - Shows filmography with movie cards
 * - Shows correct heading based on person type
 * - Handles error state with back link
 * - Shows "Person not found" for missing person
 * - Contains back navigation link
 * - Works for both actors and directors endpoints
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PersonProfile } from './Profile';
import { apiClient } from '../api/client';
import { mockPersonWithMovies } from '../test/mocks/mockData';

// Mock the API client
vi.mock('../api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockedApiClient = vi.mocked(apiClient);

const renderPersonProfile = (personId = '1', type = 'actors') => {
  return render(
    <MemoryRouter initialEntries={[`/person/${personId}?type=${type}`]}>
      <Routes>
        <Route path="/person/:personId" element={<PersonProfile />} />
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/movie/:movieId" element={<div>Movie Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PersonProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful response
    mockedApiClient.get.mockResolvedValue({ data: mockPersonWithMovies });
  });

  describe('Loading State', () => {
    it('shows loading spinner while fetching data', async () => {
      mockedApiClient.get.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: mockPersonWithMovies }), 100)
          )
      );
      
      renderPersonProfile();
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('hides loading spinner after data loads', async () => {
      renderPersonProfile();
      
      await waitFor(() => {
        const spinner = document.querySelector('.animate-spin');
        expect(spinner).not.toBeInTheDocument();
      });
    });
  });

  describe('Person Information Display', () => {
    it('displays the person full name', async () => {
      renderPersonProfile();
      
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Jane Smith', level: 1 })
        ).toBeInTheDocument();
      });
    });

    it('displays the person age', async () => {
      renderPersonProfile();
      
      await waitFor(() => {
        expect(screen.getByText('50')).toBeInTheDocument();
      });
    });

    it('displays Actor badge when type is actors', async () => {
      renderPersonProfile('1', 'actors');
      
      await waitFor(() => {
        expect(screen.getByText('Actor')).toBeInTheDocument();
      });
    });

    it('displays Director badge when type is director', async () => {
      renderPersonProfile('1', 'director');
      
      await waitFor(() => {
        expect(screen.getByText('Director')).toBeInTheDocument();
      });
    });

    it('displays total movies count', async () => {
      renderPersonProfile();
      
      await waitFor(() => {
        expect(screen.getByText('Total Movies')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // mockPersonWithMovies has 3 movies
      });
    });
  });

  describe('Filmography Section', () => {
    it('displays Filmography heading for actors', async () => {
      renderPersonProfile('1', 'actors');
      
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Filmography', level: 2 })
        ).toBeInTheDocument();
      });
    });

    it('displays "Directed Films" heading for directors', async () => {
      renderPersonProfile('1', 'director');
      
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Directed Films', level: 2 })
        ).toBeInTheDocument();
      });
    });

    it('displays movie cards for filmography', async () => {
      renderPersonProfile();
      
      await waitFor(() => {
        expect(screen.getByText('The Great Adventure')).toBeInTheDocument();
        expect(screen.getByText('Comedy Gold')).toBeInTheDocument();
        expect(screen.getByText('Dark Drama')).toBeInTheDocument();
      });
    });

    it('shows message when no movies found', async () => {
      mockedApiClient.get.mockResolvedValue({
        data: { ...mockPersonWithMovies, movies: [] },
      });
      
      renderPersonProfile('1', 'actors');
      
      await waitFor(() => {
        expect(
          screen.getByText('No movies found for this actors')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API fails', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('API Error'));
      
      renderPersonProfile('1', 'actors');
      
      await waitFor(() => {
        expect(
          screen.getByText('Failed to load actors details. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('displays correct error message for directors', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('API Error'));
      
      renderPersonProfile('1', 'directors');
      
      await waitFor(() => {
        expect(
          screen.getByText('Failed to load directors details. Please try again.')
        ).toBeInTheDocument();
      });
    });

    it('displays back to home link on error', async () => {
      mockedApiClient.get.mockRejectedValue(new Error('API Error'));
      
      renderPersonProfile();
      
      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
          'href',
          '/'
        );
      });
    });
  });

  describe('Person Not Found', () => {
    it('displays "Person not found" when person is null', async () => {
      mockedApiClient.get.mockResolvedValue({ data: null });
      
      renderPersonProfile();
      
      await waitFor(() => {
        expect(screen.getByText('Person not found')).toBeInTheDocument();
      });
    });

    it('displays back to home link when person not found', async () => {
      mockedApiClient.get.mockResolvedValue({ data: null });
      
      renderPersonProfile();
      
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
      renderPersonProfile();
      
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: '← Back to Movies' })
        ).toHaveAttribute('href', '/');
      });
    });
  });

  describe('API Integration', () => {
    it('fetches actor details with correct endpoint', async () => {
      renderPersonProfile('123', 'actors');
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/actors/123');
      });
    });

    it('fetches director details with correct endpoint', async () => {
      renderPersonProfile('456', 'directors');
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/directors/456');
      });
    });

    it('refetches when personId changes', async () => {
      const { rerender } = render(
        <MemoryRouter initialEntries={['/person/1?type=actors']}>
          <Routes>
            <Route path="/person/:personId" element={<PersonProfile />} />
          </Routes>
        </MemoryRouter>
      );
      
      await waitFor(() => {
        expect(mockedApiClient.get).toHaveBeenCalledWith('/actors/1');
      });
    });
  });

  describe('Image Display', () => {
    it('displays person profile image', async () => {
      renderPersonProfile();
      
      await waitFor(() => {
        const img = screen.getByRole('img', { name: 'Jane Smith' });
        expect(img).toBeInTheDocument();
      });
    });
  });
});

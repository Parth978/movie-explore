import { vi } from 'vitest';
import { mockMovies, mockGenres, mockMovie, mockReviews, mockPersonWithMovies } from './mockData';

// Create a mock apiClient for testing
export const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

// Helper to reset all mocks
export const resetApiMocks = () => {
  mockApiClient.get.mockReset();
  mockApiClient.post.mockReset();
  mockApiClient.put.mockReset();
  mockApiClient.delete.mockReset();
};

// Default mock implementations
export const setupDefaultMocks = () => {
  mockApiClient.get.mockImplementation((url: string) => {
    if (url === '/genres/') {
      return Promise.resolve({ data: mockGenres });
    }
    if (url === '/movies/' || url.startsWith('/movies/?')) {
      return Promise.resolve({ data: mockMovies });
    }
    if (url.match(/^\/movies\/\d+$/)) {
      return Promise.resolve({ data: mockMovie });
    }
    if (url.match(/^\/reviews\/\?movieId=\d+$/)) {
      return Promise.resolve({ data: mockReviews });
    }
    if (url.match(/^\/(actors|directors)\/\d+$/)) {
      return Promise.resolve({ data: mockPersonWithMovies });
    }
    return Promise.reject(new Error('Unknown endpoint'));
  });
};

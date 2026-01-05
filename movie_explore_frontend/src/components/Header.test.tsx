/**
 * @fileoverview Tests for Header component
 * 
 * What is being tested:
 * - Header component with navigation and branding
 * 
 * Main scenarios covered:
 * - Renders without crashing
 * - Displays the app title "Movie Plex"
 * - Contains a link to the home page
 * - Maintains proper semantic structure (header element)
 */

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';
import { renderWithRouter } from '../test/utils/renderWithRouter';

describe('Header', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('displays the app title "Movie Plex"', () => {
      renderWithRouter(<Header />);
      
      expect(
        screen.getByRole('heading', { name: 'Movie Plex', level: 1 })
      ).toBeInTheDocument();
    });

    it('uses semantic header element', () => {
      renderWithRouter(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header.tagName).toBe('HEADER');
    });
  });

  describe('Navigation', () => {
    it('contains a link to the home page', () => {
      renderWithRouter(<Header />);
      
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
    });

    it('link is clickable and functional', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Header />);
      
      const link = screen.getByRole('link');
      await user.click(link);
      
      // Link should still be present after click (navigation within SPA)
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('header has sticky positioning classes', () => {
      renderWithRouter(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header.className).toContain('sticky');
      expect(header.className).toContain('top-0');
    });

    it('title has correct styling classes', () => {
      renderWithRouter(<Header />);
      
      const title = screen.getByRole('heading', { name: 'Movie Plex' });
      expect(title.className).toContain('text-amber-300');
      expect(title.className).toContain('font-bold');
    });
  });
});

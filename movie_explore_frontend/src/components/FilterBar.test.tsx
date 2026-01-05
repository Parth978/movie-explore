/**
 * @fileoverview Tests for FilterBar component
 * 
 * What is being tested:
 * - FilterBar component that displays filter type buttons and genre selection
 * 
 * Main scenarios covered:
 * - Renders without crashing
 * - Displays all filter type buttons (title, genre, actor, director)
 * - Highlights the active filter type
 * - Shows genre buttons only when "genre" filter type is selected
 * - Handles filter type changes via callback
 * - Handles genre selection/deselection
 * - Displays selected genres as tags with remove buttons
 * - Accessibility: Remove buttons have proper aria-labels
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './FilterBar';

const mockGenres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

describe('FilterBar', () => {
  const defaultProps = {
    genres: mockGenres,
    selectedGenres: [],
    onGenreChange: vi.fn(),
    filterType: null as 'title' | 'genre' | 'actor' | 'director' | null,
    onFilterTypeChange: vi.fn(),
  };

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<FilterBar {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Title' })).toBeInTheDocument();
    });

    it('renders all filter type buttons', () => {
      render(<FilterBar {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: 'Title' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Genre' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Actor' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Director' })).toBeInTheDocument();
    });

    it('does not show genre buttons when filter type is not genre', () => {
      render(<FilterBar {...defaultProps} filterType="title" />);
      
      // Genre buttons for individual genres should not be visible
      expect(screen.queryByRole('button', { name: 'Action' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Comedy' })).not.toBeInTheDocument();
    });

    it('shows genre buttons when filter type is genre', () => {
      render(<FilterBar {...defaultProps} filterType="genre" />);
      
      mockGenres.forEach((genre) => {
        expect(screen.getByRole('button', { name: genre })).toBeInTheDocument();
      });
    });

    it('renders with empty genres array', () => {
      render(<FilterBar {...defaultProps} genres={[]} filterType="genre" />);
      
      // Should still render filter type buttons
      expect(screen.getByRole('button', { name: 'Genre' })).toBeInTheDocument();
    });
  });

  describe('Filter Type Selection', () => {
    it('calls onFilterTypeChange when clicking a filter type button', async () => {
      const user = userEvent.setup();
      const onFilterTypeChange = vi.fn();
      render(
        <FilterBar {...defaultProps} onFilterTypeChange={onFilterTypeChange} />
      );
      
      await user.click(screen.getByRole('button', { name: 'Genre' }));
      
      expect(onFilterTypeChange).toHaveBeenCalledWith('genre');
    });

    it('calls onFilterTypeChange with correct type for each button', async () => {
      const user = userEvent.setup();
      const onFilterTypeChange = vi.fn();
      render(
        <FilterBar {...defaultProps} onFilterTypeChange={onFilterTypeChange} />
      );
      
      await user.click(screen.getByRole('button', { name: 'Title' }));
      expect(onFilterTypeChange).toHaveBeenCalledWith('title');
      
      await user.click(screen.getByRole('button', { name: 'Actor' }));
      expect(onFilterTypeChange).toHaveBeenCalledWith('actor');
      
      await user.click(screen.getByRole('button', { name: 'Director' }));
      expect(onFilterTypeChange).toHaveBeenCalledWith('director');
    });
  });

  describe('Genre Selection', () => {
    it('calls onGenreChange when clicking a genre button', async () => {
      const user = userEvent.setup();
      const onGenreChange = vi.fn();
      render(
        <FilterBar
          {...defaultProps}
          filterType="genre"
          onGenreChange={onGenreChange}
        />
      );
      
      await user.click(screen.getByRole('button', { name: 'Action' }));
      
      expect(onGenreChange).toHaveBeenCalledWith('Action');
    });

    it('displays selected genres as tags when filter type is genre', () => {
      render(
        <FilterBar
          {...defaultProps}
          filterType="genre"
          selectedGenres={['Action', 'Comedy']}
        />
      );
      
      // Check for remove buttons with aria-labels
      expect(
        screen.getByRole('button', { name: 'Remove Action filter' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Remove Comedy filter' })
      ).toBeInTheDocument();
    });

    it('does not display selected genre tags when filter type is not genre', () => {
      render(
        <FilterBar
          {...defaultProps}
          filterType="title"
          selectedGenres={['Action']}
        />
      );
      
      expect(
        screen.queryByRole('button', { name: 'Remove Action filter' })
      ).not.toBeInTheDocument();
    });

    it('calls onGenreChange when clicking remove button on selected genre tag', async () => {
      const user = userEvent.setup();
      const onGenreChange = vi.fn();
      render(
        <FilterBar
          {...defaultProps}
          filterType="genre"
          selectedGenres={['Action']}
          onGenreChange={onGenreChange}
        />
      );
      
      await user.click(
        screen.getByRole('button', { name: 'Remove Action filter' })
      );
      
      expect(onGenreChange).toHaveBeenCalledWith('Action');
    });
  });

  describe('Visual States', () => {
    it('applies active styling to selected filter type', () => {
      render(<FilterBar {...defaultProps} filterType="title" />);
      
      const titleButton = screen.getByRole('button', { name: 'Title' });
      const genreButton = screen.getByRole('button', { name: 'Genre' });
      
      // Active button should have amber background class
      expect(titleButton.className).toContain('bg-amber-500');
      expect(genreButton.className).not.toContain('bg-amber-500');
    });

    it('applies selected styling to selected genre buttons', () => {
      render(
        <FilterBar
          {...defaultProps}
          filterType="genre"
          selectedGenres={['Action']}
        />
      );
      
      // Find the genre buttons (not the remove buttons in tags)
      const genreButtons = screen.getAllByRole('button', { name: 'Action' });
      const actionButton = genreButtons[0]; // First is the genre selector button
      const comedyButton = screen.getByRole('button', { name: 'Comedy' });
      
      expect(actionButton.className).toContain('bg-amber-500');
      expect(comedyButton.className).not.toContain('bg-amber-500');
    });
  });

  describe('Accessibility', () => {
    it('has accessible remove buttons for selected genres', () => {
      render(
        <FilterBar
          {...defaultProps}
          filterType="genre"
          selectedGenres={['Action', 'Drama']}
        />
      );
      
      expect(
        screen.getByRole('button', { name: 'Remove Action filter' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Remove Drama filter' })
      ).toBeInTheDocument();
    });

    it('has X icon with aria-hidden in remove buttons', () => {
      render(
        <FilterBar
          {...defaultProps}
          filterType="genre"
          selectedGenres={['Action']}
        />
      );
      
      const removeButton = screen.getByRole('button', {
        name: 'Remove Action filter',
      });
      // The SVG icon should be present inside the button
      const svg = removeButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});

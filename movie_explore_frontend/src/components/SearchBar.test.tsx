/**
 * @fileoverview Tests for SearchBar component
 * 
 * What is being tested:
 * - SearchBar component that allows users to search movies, actors, and directors
 * 
 * Main scenarios covered:
 * - Renders without crashing
 * - Displays correct placeholder text (default and custom)
 * - Shows the search input with proper accessibility attributes
 * - Handles user typing and calls onChange callback with correct values
 * - Maintains controlled input state
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const onChange = vi.fn();
      render(<SearchBar value="" onChange={onChange} />);
      
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with default placeholder text', () => {
      const onChange = vi.fn();
      render(<SearchBar value="" onChange={onChange} />);
      
      expect(
        screen.getByPlaceholderText('Search movies, actors, directors...')
      ).toBeInTheDocument();
    });

    it('renders with custom placeholder text', () => {
      const onChange = vi.fn();
      render(
        <SearchBar
          value=""
          onChange={onChange}
          placeholder="Find your favorite film"
        />
      );
      
      expect(
        screen.getByPlaceholderText('Find your favorite film')
      ).toBeInTheDocument();
    });

    it('displays the correct aria-label for accessibility', () => {
      const onChange = vi.fn();
      render(<SearchBar value="" onChange={onChange} />);
      
      expect(
        screen.getByLabelText('Search movies, actors, and directors')
      ).toBeInTheDocument();
    });

    it('renders with the provided value', () => {
      const onChange = vi.fn();
      render(<SearchBar value="Inception" onChange={onChange} />);
      
      expect(screen.getByRole('textbox')).toHaveValue('Inception');
    });
  });

  describe('User Interactions', () => {
    it('calls onChange when user types', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<SearchBar value="" onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'Matrix');
      
      // Each character typed calls onChange
      expect(onChange).toHaveBeenCalledTimes(6);
      expect(onChange).toHaveBeenNthCalledWith(1, 'M');
      expect(onChange).toHaveBeenNthCalledWith(2, 'a');
      expect(onChange).toHaveBeenNthCalledWith(3, 't');
    });

    it('calls onChange with correct value when clearing input', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<SearchBar value="test" onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('allows focus on the input element', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<SearchBar value="" onChange={onChange} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(input).toHaveFocus();
    });
  });

  describe('Controlled Component Behavior', () => {
    it('reflects value changes from parent component', () => {
      const onChange = vi.fn();
      const { rerender } = render(<SearchBar value="" onChange={onChange} />);
      
      expect(screen.getByRole('textbox')).toHaveValue('');
      
      rerender(<SearchBar value="New Value" onChange={onChange} />);
      
      expect(screen.getByRole('textbox')).toHaveValue('New Value');
    });
  });
});

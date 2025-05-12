import { render, screen } from '@testing-library/react';
import SearchResultsDisplay from './SearchResultsDisplay';
import { describe, it, expect, vi } from 'vitest';

describe('SearchResultsDisplay', () => {
  const mockOnSelectItem = vi.fn();

  it('renders a message when there are no results', () => {
    render(<SearchResultsDisplay results={[]} isLoading={false} error={null} onSelectItem={mockOnSelectItem} />);
    const messageElement = screen.getByText(/no results found/i);
    expect(messageElement).toBeInTheDocument();
  });

  it('renders a loading message when loading', () => {
    render(<SearchResultsDisplay results={[]} isLoading={true} error={null} onSelectItem={mockOnSelectItem} />);
    const loadingElement = screen.getByText(/loading search results.../i);
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders an error message when there is an error', () => {
    render(<SearchResultsDisplay results={[]} isLoading={false} error="Test Error" onSelectItem={mockOnSelectItem} />);
    const errorElement = screen.getByText(/error: test error/i);
    expect(errorElement).toBeInTheDocument();
  });

  // Add more tests here for functionality like:
  // - Displaying a list of search results
  // - Clicking on a result navigates to the item detail view
});
import { render, screen } from '@testing-library/react';
import ItemDetailView from './ItemDetailView';
import { describe, it, expect } from 'vitest';

describe('ItemDetailView', () => {
  it('renders a loading message when isLoading is true', () => {
    render(<ItemDetailView itemId="test-id" itemData={null} isLoading={true} />);
    const loadingMessage = screen.getByText(/loading item details.../i);
    expect(loadingMessage).toBeInTheDocument();
  });

  it('renders a message when no itemData is provided and not loading', () => {
    render(<ItemDetailView itemId="test-id" itemData={null} isLoading={false} />);
    const selectMessage = screen.getByText(/select an item to see details./i);
    expect(selectMessage).toBeInTheDocument();
  });

  // Add more tests here for functionality like:
  // - Displaying item details when an item is provided
  // - Handling error states
  // - Displaying related items or connections
});
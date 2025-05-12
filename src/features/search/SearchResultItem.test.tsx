import { render, screen, fireEvent } from '@testing-library/react';
import SearchResultItem from './SearchResultItem'; // Assuming the component exists at this path
import { describe, it, expect, vi } from 'vitest';

// Mock data for a search result item
const mockItemWithImage = {
  id: 'q123',
  label: 'Test Item Label',
  description: 'This is a test item description.',
  thumbnailUrl: 'http://example.com/image.jpg',
};

const mockItemWithoutImage = {
  id: 'q456',
  label: 'Another Item',
  description: 'Description for another item, no image.',
  thumbnailUrl: undefined, // or null
};

describe('SearchResultItem', () => {
  it('renders item label and description', () => {
    const mockOnClick = vi.fn();
    render(<SearchResultItem item={mockItemWithImage} onClick={mockOnClick} />);

    expect(screen.getByText(mockItemWithImage.label)).toBeInTheDocument();
    expect(screen.getByText(mockItemWithImage.description)).toBeInTheDocument();
  });

  it('renders item thumbnail when thumbnailUrl is provided', () => {
    const mockOnClick = vi.fn();
    render(<SearchResultItem item={mockItemWithImage} onClick={mockOnClick} />);

    const imageElement = screen.getByRole('img', { name: mockItemWithImage.label });
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockItemWithImage.thumbnailUrl);
  });

  it('does not render an img tag if thumbnailUrl is not provided', () => {
    const mockOnClick = vi.fn();
    render(<SearchResultItem item={mockItemWithoutImage} onClick={mockOnClick} />);

    // Check that no img tag is rendered.
    // A more specific check might be for a placeholder, depending on implementation.
    const imageElement = screen.queryByRole('img');
    expect(imageElement).not.toBeInTheDocument();
  });

  it('calls onClick with the item id when the item is clicked', () => {
    const mockOnClick = vi.fn();
    render(<SearchResultItem item={mockItemWithImage} onClick={mockOnClick} />);

    // Assuming the entire item container is clickable
    const containerElement = screen.getByText(mockItemWithImage.label).closest('div'); // Or a more specific selector
    if (containerElement) {
      fireEvent.click(containerElement);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockItemWithImage.id);
    } else {
      // Fail the test if the container isn't found, as clickability is key
      throw new Error("SearchResultItem container not found for click test.");
    }
  });

  it('renders correctly without an onClick handler (if optional)', () => {
    // This test assumes onClick might be optional. If it's mandatory, this test is not needed.
    render(<SearchResultItem item={mockItemWithoutImage} />);
    expect(screen.getByText(mockItemWithoutImage.label)).toBeInTheDocument();
    // Attempt to click and ensure no error if onClick is not provided
    const containerElement = screen.getByText(mockItemWithoutImage.label).closest('div');
    if (containerElement) {
      expect(() => fireEvent.click(containerElement)).not.toThrow();
    }
  });
});
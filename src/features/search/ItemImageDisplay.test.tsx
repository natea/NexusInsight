import { render, screen } from '@testing-library/react';
import ItemImageDisplay from './ItemImageDisplay'; // Assuming the component exists at this path
import { describe, it, expect } from 'vitest';

const mockImageData = {
  imageUrl: 'http://example.com/image.png',
  altText: 'A test image',
  attribution: 'Photo by Tester',
};

const mockImageDataNoAttribution = {
  imageUrl: 'http://example.com/image2.png',
  altText: 'Another test image',
  attribution: undefined,
};

describe('ItemImageDisplay', () => {
  it('renders an image with src and alt attributes when imageUrl and altText are provided', () => {
    render(<ItemImageDisplay 
      imageUrl={mockImageData.imageUrl} 
      altText={mockImageData.altText} 
      attribution={mockImageData.attribution} 
    />);

    const imageElement = screen.getByRole('img', { name: mockImageData.altText });
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockImageData.imageUrl);
  });

  it('renders attribution when provided', () => {
    render(<ItemImageDisplay 
      imageUrl={mockImageData.imageUrl} 
      altText={mockImageData.altText} 
      attribution={mockImageData.attribution} 
    />);
    // Assuming attribution is rendered in a <figcaption> or similar, or just as text
    expect(screen.getByText(mockImageData.attribution)).toBeInTheDocument();
  });

  it('does not render attribution if not provided', () => {
    render(<ItemImageDisplay 
      imageUrl={mockImageDataNoAttribution.imageUrl} 
      altText={mockImageDataNoAttribution.altText} 
      attribution={mockImageDataNoAttribution.attribution} 
    />);
    // This depends on how attribution is structured. If it's just text, queryByText would work.
    // If there's a specific element for attribution, query for that.
    expect(screen.queryByText(mockImageData.attribution)).not.toBeInTheDocument(); // Check against a known attribution
  });

  it('renders a placeholder or message when imageUrl is not provided', () => {
    render(<ItemImageDisplay 
      imageUrl={undefined} 
      altText="Placeholder for no image" 
      attribution={undefined} 
    />);
    
    // Option 1: Check for a placeholder image with specific alt text
    // const placeholderImage = screen.queryByRole('img', { name: /placeholder/i });
    // expect(placeholderImage).toBeInTheDocument();

    // Option 2: Check for a specific message
    expect(screen.getByText('No image available')).toBeInTheDocument(); // Assuming this message is rendered

    // Option 3: Check that the main image role is not present if only a message is shown
    // const imageElement = screen.queryByRole('img', { name: mockImageData.altText }); // using a known alt text that shouldn't be there
    // expect(imageElement).not.toBeInTheDocument();
  });

  it('renders alt text correctly even if image fails to load (browser behavior, but good to have alt)', () => {
    // This test primarily ensures altText is passed to the img tag.
    // Actual image load failure is harder to test in JSDOM without complex mocks.
    render(<ItemImageDisplay 
      imageUrl="http://example.com/nonexistent.jpg" 
      altText="Image of a Cat" 
      attribution={undefined} 
    />);
    const imageElement = screen.getByRole('img');
    expect(imageElement).toHaveAttribute('alt', 'Image of a Cat');
  });
});
import { render, screen } from '@testing-library/react';
import KeyInformationBox from './KeyInformationBox'; // Assuming the component exists at this path
import { describe, it, expect } from 'vitest';

// Mock data for key facts
const mockKeyFacts = [
  { propertyLabel: 'Instance of', propertyId: 'P31', valueLabel: 'Human', valueId: 'Q5' },
  { propertyLabel: 'Date of Birth', propertyId: 'P569', valueLabel: '1 January 1970', valueId: null }, // Value might not always be a QID
  { propertyLabel: 'Occupation', propertyId: 'P106', valueLabel: 'Software Developer', valueId: 'Q82594' },
];

const mockKeyFactsWithLinks = [
  { 
    propertyLabel: 'Capital of', 
    propertyId: 'P36', 
    valueLabel: 'Germany', 
    valueId: 'Q183', 
    valueLink: '/item/Q183' // Example internal link
  },
  { 
    propertyLabel: 'Official Website', 
    propertyId: 'P856', 
    valueLabel: 'example.com', 
    valueId: null, 
    valueLink: 'http://example.com' // Example external link
  },
];

describe('KeyInformationBox', () => {
  it('renders a list of key facts with labels and values', () => {
    render(<KeyInformationBox title="Key Facts" facts={mockKeyFacts} />);

    expect(screen.getByText('Key Facts')).toBeInTheDocument(); // Title

    mockKeyFacts.forEach(fact => {
      expect(screen.getByText(fact.propertyLabel + ':')).toBeInTheDocument(); // Assuming colon is added
      expect(screen.getByText(fact.valueLabel)).toBeInTheDocument();
    });
  });

  it('renders "No key information available." when facts array is empty', () => {
    render(<KeyInformationBox title="Details" facts={[]} />);
    expect(screen.getByText('No key information available.')).toBeInTheDocument();
    // Also check that no fact elements are rendered
    expect(screen.queryByText(/:/)).not.toBeInTheDocument(); // Check for absence of property labels
  });

  it('renders "No key information available." when facts prop is not provided (or undefined)', () => {
    render(<KeyInformationBox title="Details" facts={undefined} />);
    expect(screen.getByText('No key information available.')).toBeInTheDocument();
  });

  it('renders links for values when valueLink is provided', () => {
    render(<KeyInformationBox title="Linked Facts" facts={mockKeyFactsWithLinks} />);

    const germanyLink = screen.getByRole('link', { name: 'Germany' });
    expect(germanyLink).toBeInTheDocument();
    expect(germanyLink).toHaveAttribute('href', '/item/Q183');

    const websiteLink = screen.getByRole('link', { name: 'example.com' });
    expect(websiteLink).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute('href', 'http://example.com');
  });

  it('does not render a link if valueLink is not provided for a fact', () => {
    render(<KeyInformationBox title="Facts" facts={mockKeyFacts} />);
    // Check that 'Human' (which has no valueLink in mockKeyFacts) is not a link
    const humanValue = screen.getByText('Human');
    expect(humanValue.tagName).not.toBe('A');
    // Or more explicitly, ensure it's not queryable by role 'link'
    expect(screen.queryByRole('link', { name: 'Human' })).not.toBeInTheDocument();
  });

  it('displays the title provided in props', () => {
    const customTitle = "Important Details";
    render(<KeyInformationBox title={customTitle} facts={mockKeyFacts} />);
    expect(screen.getByRole('heading', { name: customTitle })).toBeInTheDocument();
  });
});
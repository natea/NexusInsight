import { render, screen } from '@testing-library/react';
// import { within } from '@testing-library/react'; // For more complex queries if needed
import StatementsRelationshipsSection from './StatementsRelationshipsSection'; // Assuming the component exists
import { describe, it, expect } from 'vitest';

// Mock data for statements
const mockStatements = {
  P31: [ // Instance of
    { valueLabel: 'Human', valueId: 'Q5', valueLink: '/item/Q5', rank: 'normal' },
    { valueLabel: 'Politician', valueId: 'Q82955', valueLink: '/item/Q82955', rank: 'normal' }
  ],
  P27: [ // Country of Citizenship
    { valueLabel: 'United States of America', valueId: 'Q30', valueLink: '/item/Q30', rank: 'preferred' }
  ],
  P569: [ // Date of Birth
    { valueLabel: '4 August 1961', valueId: null, valueType: 'time', rank: 'normal' }
  ],
  P106: [ // Occupation (no valueLink for one)
    { valueLabel: 'Lawyer', valueId: 'Q40348', valueLink: '/item/Q40348', rank: 'normal' },
    { valueLabel: 'Author', valueId: 'Q36180', rank: 'normal' }
  ]
};

const mockPropertyLabels = {
  P31: 'Instance of',
  P27: 'Country of Citizenship',
  P569: 'Date of Birth',
  P106: 'Occupation',
};

describe('StatementsRelationshipsSection', () => {
  it('renders a title for the section', () => {
    render(<StatementsRelationshipsSection title="Statements" statements={mockStatements} propertyLabels={mockPropertyLabels} />);
    expect(screen.getByRole('heading', { name: "Statements" })).toBeInTheDocument();
  });

  it('renders statements grouped by property labels', () => {
    render(<StatementsRelationshipsSection title="Details" statements={mockStatements} propertyLabels={mockPropertyLabels} />);

    expect(screen.getByText(`${mockPropertyLabels.P31} (P31)`)).toBeInTheDocument();
    expect(screen.getByText(`${mockPropertyLabels.P27} (P27)`)).toBeInTheDocument();
    expect(screen.getByText(`${mockPropertyLabels.P569} (P569)`)).toBeInTheDocument();
    expect(screen.getByText(`${mockPropertyLabels.P106} (P106)`)).toBeInTheDocument();
  });

  it('renders multiple values for a single property', () => {
    render(<StatementsRelationshipsSection title="Details" statements={mockStatements} propertyLabels={mockPropertyLabels} />);
    // For P31 (Instance of)
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Politician')).toBeInTheDocument();
  });

  it('renders links for statement values when valueLink is provided', () => {
    render(<StatementsRelationshipsSection title="Details" statements={mockStatements} propertyLabels={mockPropertyLabels} />);
    
    const humanLink = screen.getByRole('link', { name: 'Human' });
    expect(humanLink).toBeInTheDocument();
    expect(humanLink).toHaveAttribute('href', '/item/Q5');

    const usaLink = screen.getByRole('link', { name: 'United States of America' });
    expect(usaLink).toBeInTheDocument();
    expect(usaLink).toHaveAttribute('href', '/item/Q30');
  });

  it('renders plain text for statement values when valueLink is not provided', () => {
    render(<StatementsRelationshipsSection title="Details" statements={mockStatements} propertyLabels={mockPropertyLabels} />);

    const dobValue = screen.getByText('4 August 1961');
    expect(dobValue).toBeInTheDocument();
    expect(dobValue.tagName).not.toBe('A');
    expect(screen.queryByRole('link', { name: '4 August 1961' })).not.toBeInTheDocument();

    const authorValue = screen.getByText('Author'); // P106, second value has no link
    expect(authorValue).toBeInTheDocument();
    expect(authorValue.tagName).not.toBe('A');
    expect(screen.queryByRole('link', { name: 'Author' })).not.toBeInTheDocument();
  });

  it('displays PIDs (Property IDs) for each property group or near property label', () => {
    render(<StatementsRelationshipsSection title="Details" statements={mockStatements} propertyLabels={mockPropertyLabels} />);
    // This test assumes PIDs are displayed, e.g., "(P31)" next to "Instance of"
    // The exact implementation of PID display will determine how to query this.
    // Example: Check for text containing the PID.
    Object.keys(mockPropertyLabels).forEach(pid => {
      expect(screen.getByText(new RegExp(pid))).toBeInTheDocument(); 
      // A more specific query might be:
      // const propertyHeading = screen.getByText(mockPropertyLabels[pid]);
      // expect(within(propertyHeading.closest('section_or_div_element')).getByText(`(${pid})`)).toBeInTheDocument();
    });
    // Check one specific PID
    expect(screen.getByText(/P31/)).toBeInTheDocument(); 
  });

  it('renders "No statements available." when statements object is empty', () => {
    render(<StatementsRelationshipsSection title="Statements" statements={{}} propertyLabels={mockPropertyLabels} />);
    expect(screen.getByText('No statements available.')).toBeInTheDocument();
  });

  it('renders "No statements available." when statements prop is not provided', () => {
    render(<StatementsRelationshipsSection title="Statements" statements={undefined} propertyLabels={mockPropertyLabels} />);
    expect(screen.getByText('No statements available.')).toBeInTheDocument();
  });

  it('handles missing property labels gracefully (e.g. shows PID only or a default)', () => {
    const statementsWithMissingLabel = { P999: [{ valueLabel: 'Test Value', valueId: 'Q999' }] };
    render(<StatementsRelationshipsSection title="Details" statements={statementsWithMissingLabel} propertyLabels={{}} />);
    // If it falls back to showing PID as label:
    expect(screen.getByText('P999')).toBeInTheDocument(); 
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });
});
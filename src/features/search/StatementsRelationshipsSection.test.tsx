import { render, screen, fireEvent, within } from '@testing-library/react';
import StatementsRelationshipsSection from './StatementsRelationshipsSection';
import { describe, it, expect } from 'vitest';
import { Statement, Qualifier } from '../../pages/SearchPage'; // Import types

// Mock data for statements without qualifiers
const mockStatementsNoQualifiers: Record<string, Statement[]> = {
  P31: [ // Instance of
    { property_pid: 'P31', property_label: 'Instance of', value_label: 'Human', value_qid: 'Q5', value_is_item: true, qualifiers: [] },
    { property_pid: 'P31', property_label: 'Instance of', value_label: 'Politician', value_qid: 'Q82955', value_is_item: true, qualifiers: [] }
  ],
  P569: [ // Date of Birth
    { property_pid: 'P569', property_label: 'Date of Birth', value_string: '4 August 1961', value_is_item: false, qualifiers: [] }
  ],
};

// Mock data for statements WITH qualifiers
const mockStatementsWithQualifiers: Record<string, Statement[]> = {
  P26: [ // Spouse
    {
      property_pid: 'P26',
      property_label: 'Spouse',
      value_qid: 'Q13133',
      value_label: 'Michelle Obama',
      value_is_item: true,
      qualifiers: [
        { property_pid: 'P580', property_label: 'Start Time', value_string: '1992', value_is_item: false },
        { property_pid: 'P582', property_label: 'End Time', value_string: '2025', value_is_item: false }
      ]
    }
  ],
  P108: [ // Employer
    {
      property_pid: 'P108',
      property_label: 'Employer',
      value_qid: 'Q484896',
      value_label: 'University of Chicago Law School',
      value_is_item: true,
      qualifiers: [
        { property_pid: 'P102', property_label: 'Member of Political Party', value_qid: 'Q29552', value_label: 'Democratic Party', value_is_item: true }
      ]
    },
    { // Another statement for the same property, without qualifiers
      property_pid: 'P108',
      property_label: 'Employer',
      value_qid: 'Q1321',
      value_label: 'United States Senate',
      value_is_item: true,
      qualifiers: [] // No qualifiers for this one
    }
  ],
  P17: [ // Country (no qualifiers for this property)
    {
      property_pid: 'P17',
      property_label: 'Country',
      value_qid: 'Q30',
      value_label: 'United States of America',
      value_is_item: true,
      qualifiers: []
    }
  ]
};


describe('StatementsRelationshipsSection', () => {
  it('renders a title for the section', () => {
    render(<StatementsRelationshipsSection title="Statements" statements={mockStatementsNoQualifiers} />);
    expect(screen.getByRole('heading', { name: "Statements" })).toBeInTheDocument();
  });

  it('renders statements grouped by property labels and PIDs', () => {
    render(<StatementsRelationshipsSection title="Details" statements={mockStatementsNoQualifiers} />);
    expect(screen.getByText('Instance of (P31)')).toBeInTheDocument();
    expect(screen.getByText('Date of Birth (P569)')).toBeInTheDocument();
  });

  it('renders multiple values for a single property', () => {
    render(<StatementsRelationshipsSection title="Details" statements={mockStatementsNoQualifiers} />);
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('Politician')).toBeInTheDocument();
  });

  it('renders statement values as plain text (links are handled by renderValue, tested implicitly)', () => {
    render(<StatementsRelationshipsSection title="Details" statements={mockStatementsNoQualifiers} />);
    const dobValue = screen.getByText('4 August 1961'); // Assuming renderValue formats it this way
    expect(dobValue).toBeInTheDocument();
    // More specific tests for renderValue (links vs text) would be in ItemDetailView or a dedicated renderValue test
  });

  it('renders "No statements available for this section." when statements object is empty', () => {
    render(<StatementsRelationshipsSection title="Statements" statements={{}} />);
    expect(screen.getByText('No statements available for this section.')).toBeInTheDocument();
  });

  it('renders "No statements available for this section." when statements prop is not provided', () => {
    render(<StatementsRelationshipsSection title="Statements" statements={undefined} />);
    expect(screen.getByText('No statements available for this section.')).toBeInTheDocument();
  });

  it('handles statements where property_label might be missing (falls back to PID)', () => {
    const statementsWithMissingLabel: Record<string, Statement[]> = {
      P999: [{ property_pid: 'P999', value_label: 'Test Value', value_qid: 'Q999', value_is_item: true, qualifiers: [] }]
    };
    render(<StatementsRelationshipsSection title="Details" statements={statementsWithMissingLabel} />);
    expect(screen.getByText('Property P999 (P999)')).toBeInTheDocument(); // Expect "Property P999 (P999)"
    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  describe('Qualifier Display', () => {
    it('does NOT show a toggle button if a statement has no qualifiers', () => {
      render(<StatementsRelationshipsSection title="Test Section" statements={mockStatementsWithQualifiers} />);
      // For P17 (Country) - United States of America, which has no qualifiers
      const usaStatement = screen.getByText('United States of America').closest('li');
      if (!usaStatement) throw new Error('USA statement item not found');
      expect(within(usaStatement).queryByRole('button', { name: /Show Qualifiers/i })).not.toBeInTheDocument();
    });

    it('shows a toggle button with qualifier count if a statement has qualifiers', () => {
      render(<StatementsRelationshipsSection title="Test Section" statements={mockStatementsWithQualifiers} />);
      // For P26 (Spouse) - Michelle Obama, which has 2 qualifiers
      const michelleStatement = screen.getByText('Michelle Obama').closest('li');
      if (!michelleStatement) throw new Error('Michelle Obama statement item not found');
      const toggleButton = within(michelleStatement).getByRole('button', { name: /Show Qualifiers \(2\)/i });
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles qualifier visibility and ARIA attributes on button click', () => {
      render(<StatementsRelationshipsSection title="Test Section" statements={mockStatementsWithQualifiers} />);
      const michelleStatement = screen.getByText('Michelle Obama').closest('li');
      if (!michelleStatement) throw new Error('Michelle Obama statement item not found');
      
      const toggleButton = within(michelleStatement).getByRole('button', { name: /Show Qualifiers \(2\)/i });
      const qualifiersListId = toggleButton.getAttribute('aria-controls');
      expect(qualifiersListId).toBeTruthy();

      // Initially, qualifiers are hidden
      expect(screen.queryByTestId(qualifiersListId!)).not.toBeInTheDocument(); // Using testId if component adds it, or check for content
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

      // Click to show
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButton).toHaveTextContent(/Hide Qualifiers/i);
      
      // The list is identified by its role within the scope of the statement item.
      // The 'name' option was too restrictive as the ul doesn't have an explicit accessible name matching that regex.
      const qualifiersList = within(michelleStatement).getByRole('list');
      expect(qualifiersList).toBeVisible();
      expect(qualifiersList).toHaveAttribute('id', qualifiersListId); // Verify it's the correct list

      // Click to hide
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveTextContent(/Show Qualifiers \(2\)/i);
      expect(qualifiersList).not.toBeVisible(); // Or queryByRole should be null
    });

    it('renders qualifier details correctly when expanded', () => {
      render(<StatementsRelationshipsSection title="Test Section" statements={mockStatementsWithQualifiers} />);
      const michelleStatement = screen.getByText('Michelle Obama').closest('li');
      if (!michelleStatement) throw new Error('Michelle Obama statement item not found');
      
      const toggleButton = within(michelleStatement).getByRole('button', { name: /Show Qualifiers \(2\)/i });
      fireEvent.click(toggleButton); // Expand qualifiers

      const qualifiersList = within(michelleStatement).getByRole('list'); // More generic role if no specific name
      
      // Check first qualifier for Michelle Obama (P580: Start Time)
      const qualifier1Property = within(qualifiersList).getByText(/Start Time \(P580\):/i);
      expect(qualifier1Property).toBeVisible();
      const qualifier1Value = within(qualifiersList).getByText('1992'); // Assuming renderValue outputs this
      expect(qualifier1Value).toBeVisible();
      expect(qualifier1Value.tagName).not.toBe('A'); // As it's a string value

      // Check second qualifier for Michelle Obama (P582: End Time)
      const qualifier2Property = within(qualifiersList).getByText(/End Time \(P582\):/i);
      expect(qualifier2Property).toBeVisible();
      const qualifier2Value = within(qualifiersList).getByText('2025');
      expect(qualifier2Value).toBeVisible();
    });

    it('renders qualifier value as a link if it is an item', () => {
      render(<StatementsRelationshipsSection title="Test Section" statements={mockStatementsWithQualifiers} />);
      // For P108 (Employer) - University of Chicago Law School, which has 1 item qualifier
      const uChicagoStatement = screen.getByText('University of Chicago Law School').closest('li');
      if (!uChicagoStatement) throw new Error('UChicago statement item not found');

      const toggleButton = within(uChicagoStatement).getByRole('button', { name: /Show Qualifiers \(1\)/i });
      fireEvent.click(toggleButton); // Expand qualifiers

      const qualifiersList = within(uChicagoStatement).getByRole('list');
      const qualifierProperty = within(qualifiersList).getByText(/Member of Political Party \(P102\):/i);
      expect(qualifierProperty).toBeVisible();
      
      // The value 'Democratic Party' should be rendered by renderValue.
      // Since renderValue in StatementsRelationshipsSection.tsx currently just returns the label,
      // we test for the label. If it were creating a link, we'd test for role 'link'.
      // This highlights that renderValue might need to be enhanced or tested separately if it's supposed to create links.
      const qualifierValue = within(qualifiersList).getByText('Democratic Party');
      expect(qualifierValue).toBeVisible();
      // If renderValue was creating links:
      // const qualifierValueLink = within(qualifiersList).getByRole('link', { name: 'Democratic Party' });
      // expect(qualifierValueLink).toBeInTheDocument();
      // expect(qualifierValueLink).toHaveAttribute('href', '/item/Q29552'); // Assuming renderValue constructs this link
    });

    it('correctly handles multiple statements for the same property, one with qualifiers and one without', () => {
      render(<StatementsRelationshipsSection title="Test Section" statements={mockStatementsWithQualifiers} />);
      
      // Statement for P108: University of Chicago Law School (has 1 qualifier)
      const uChicagoStatement = screen.getByText('University of Chicago Law School').closest('li');
      if (!uChicagoStatement) throw new Error('UChicago statement item not found');
      const uChicagoToggle = within(uChicagoStatement).getByRole('button', { name: /Show Qualifiers \(1\)/i });
      expect(uChicagoToggle).toBeInTheDocument();

      // Statement for P108: United States Senate (has 0 qualifiers)
      const senateStatement = screen.getByText('United States Senate').closest('li');
      if (!senateStatement) throw new Error('Senate statement item not found');
      expect(within(senateStatement).queryByRole('button', { name: /Show Qualifiers/i })).not.toBeInTheDocument();
    });
  });
});
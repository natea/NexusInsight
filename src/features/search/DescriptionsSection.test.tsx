import { render, screen } from '@testing-library/react';
import DescriptionsSection from './DescriptionsSection'; // Assuming the component exists at this path
import { describe, it, expect } from 'vitest';

// Mock data for descriptions
const mockDescriptions = [
  { lang: 'en', value: 'English description of the item.' },
  { lang: 'es', value: 'Descripción en español del ítem.' },
  { lang: 'fr', value: 'Description en français de l\'article.' },
];

const mockSingleDescription = [
  { lang: 'de', value: 'Deutsche Beschreibung des Artikels.' },
];

describe('DescriptionsSection', () => {
  it('renders a list of descriptions with language codes and values', () => {
    render(<DescriptionsSection title="Available Descriptions" descriptions={mockDescriptions} />);

    expect(screen.getByText('Available Descriptions')).toBeInTheDocument(); // Title

    mockDescriptions.forEach(desc => {
      // Assuming the language code is displayed, e.g., "EN:" or "(en)"
      // This test might need adjustment based on actual rendering logic.
      // For now, let's check for the presence of the description value.
      expect(screen.getByText(desc.value)).toBeInTheDocument();
      // A more robust test would be to check for a structure like:
      // const langElement = screen.getByText(new RegExp(`${desc.lang}:`, 'i'));
      // expect(langElement).toBeInTheDocument();
      // expect(within(langElement.parentElement).getByText(desc.value)).toBeInTheDocument();
    });
    // Example check for one specific language and its description
    expect(screen.getByText('English description of the item.')).toBeInTheDocument();
    // Check for language indicator if implemented, e.g.
    // expect(screen.getByText(/en/i)).toBeInTheDocument(); // This is a loose match
  });

  it('renders "No descriptions available." when descriptions array is empty', () => {
    render(<DescriptionsSection title="Descriptions" descriptions={[]} />);
    expect(screen.getByText('No descriptions available.')).toBeInTheDocument();
  });

  it('renders "No descriptions available." when descriptions prop is not provided (or undefined)', () => {
    render(<DescriptionsSection title="Descriptions" descriptions={undefined} />);
    expect(screen.getByText('No descriptions available.')).toBeInTheDocument();
  });

  it('displays the title provided in props', () => {
    const customTitle = "Item Descriptions in Various Languages";
    render(<DescriptionsSection title={customTitle} descriptions={mockSingleDescription} />);
    expect(screen.getByRole('heading', { name: customTitle })).toBeInTheDocument();
  });

  it('renders descriptions correctly when only one description is provided', () => {
    render(<DescriptionsSection title="Description" descriptions={mockSingleDescription} />);
    expect(screen.getByText(mockSingleDescription[0].value)).toBeInTheDocument();
    // Check for language indicator if implemented, e.g.
    // expect(screen.getByText(/de/i)).toBeInTheDocument();
  });
});
import { render, screen, fireEvent } from '@testing-library/react';
import MetadataLinksSection from './MetadataLinksSection'; // Assuming the component exists
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockQid = 'Q12345';
const wikidataBaseUrl = 'https://www.wikidata.org/wiki/';

// Mock navigator.clipboard for copy functionality
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
  configurable: true, // Important for re-mocking if needed in other test files
});


describe('MetadataLinksSection', () => {
  beforeEach(() => {
    // Clear mock call history before each test
    (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockClear();
  });

  it('renders a title for the section', () => {
    render(<MetadataLinksSection qid={mockQid} title="Metadata & Links" />);
    expect(screen.getByRole('heading', { name: "Metadata & Links" })).toBeInTheDocument();
  });

  it('renders a link to the item on wikidata.org', () => {
    render(<MetadataLinksSection qid={mockQid} title="Links" />);
    const wikidataLink = screen.getByRole('link', { name: /view on wikidata\.org/i }); // Or more specific text
    expect(wikidataLink).toBeInTheDocument();
    expect(wikidataLink).toHaveAttribute('href', `${wikidataBaseUrl}${mockQid}`);
    expect(wikidataLink).toHaveAttribute('target', '_blank'); // Assuming it opens in a new tab
  });

  it('displays the QID', () => {
    render(<MetadataLinksSection qid={mockQid} title="Metadata" />);
    expect(screen.getByText(`Item QID: ${mockQid}`)).toBeInTheDocument(); // Assuming this display format
  });

  it('provides a button to copy the QID', async () => {
    render(<MetadataLinksSection qid={mockQid} title="Metadata" />);
    const copyButton = screen.getByRole('button', { name: /copy qid/i });
    expect(copyButton).toBeInTheDocument();

    await fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockQid);
  });

  it('renders gracefully if QID is not provided (e.g., shows a message or nothing)', () => {
    render(<MetadataLinksSection qid={undefined} title="Metadata" />);
    // Depending on desired behavior:
    // Option 1: Show a message
    // expect(screen.getByText('QID not available')).toBeInTheDocument();
    // Option 2: Render nothing or hide the section (less likely for a dedicated section)
    expect(screen.queryByText(/Item QID:/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /view on wikidata\.org/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /copy qid/i })).not.toBeInTheDocument();
  });

  it('uses the provided title prop', () => {
    const customTitle = "External Resources";
    render(<MetadataLinksSection qid={mockQid} title={customTitle} />);
    expect(screen.getByRole('heading', { name: customTitle })).toBeInTheDocument();
  });
});
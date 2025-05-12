import { render, screen, fireEvent } from '@testing-library/react';
import ItemHeader from './ItemHeader'; // Assuming the component exists at this path
import { describe, it, expect, vi } from 'vitest';

// Mock data for an item header
const mockItemData = {
  label: 'Test Item Label',
  qid: 'Q12345',
  description: 'A detailed description of the test item.',
  aliases: ['Test Alias 1', 'Test Alias 2'],
};

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

describe('ItemHeader', () => {
  it('renders item label, QID, and description', () => {
    render(<ItemHeader 
      label={mockItemData.label} 
      qid={mockItemData.qid} 
      description={mockItemData.description} 
      aliases={mockItemData.aliases} 
    />);

    expect(screen.getByText(mockItemData.label)).toBeInTheDocument();
    expect(screen.getByText(`(${mockItemData.qid})`)).toBeInTheDocument(); // Assuming QID is displayed like this
    expect(screen.getByText(mockItemData.description)).toBeInTheDocument();
  });

  it('renders aliases if provided', () => {
    render(<ItemHeader 
      label={mockItemData.label} 
      qid={mockItemData.qid} 
      description={mockItemData.description} 
      aliases={mockItemData.aliases} 
    />);
    // Assuming aliases are rendered in a way that can be queried, e.g., each in a list item or specific element
    // For this example, let's assume they are joined or rendered in a specific container.
    // This test might need adjustment based on actual rendering logic.
    expect(screen.getByText(/Test Alias 1/)).toBeInTheDocument();
    expect(screen.getByText(/Test Alias 2/)).toBeInTheDocument();
  });

  it('does not render aliases section if aliases array is empty or not provided', () => {
    const { rerender } = render(<ItemHeader 
      label={mockItemData.label} 
      qid={mockItemData.qid} 
      description={mockItemData.description} 
      aliases={[]} 
    />);
    // This assertion depends on how "no aliases" is represented.
    // If an "Aliases:" heading or section is only rendered when aliases exist:
    expect(screen.queryByText(/Aliases:/i)).not.toBeInTheDocument(); // Example
    expect(screen.queryByText(/Test Alias 1/)).not.toBeInTheDocument();

    rerender(<ItemHeader 
      label={mockItemData.label} 
      qid={mockItemData.qid} 
      description={mockItemData.description} 
      aliases={undefined} 
    />);
    expect(screen.queryByText(/Aliases:/i)).not.toBeInTheDocument(); // Example
    expect(screen.queryByText(/Test Alias 1/)).not.toBeInTheDocument();
  });

  it('has a copy button for QID that calls navigator.clipboard.writeText', async () => {
    render(<ItemHeader 
      label={mockItemData.label} 
      qid={mockItemData.qid} 
      description={mockItemData.description} 
      aliases={mockItemData.aliases} 
    />);

    // Assuming there's a button with accessible name "Copy QID" or similar
    const copyButton = screen.getByRole('button', { name: /copy qid/i });
    expect(copyButton).toBeInTheDocument();

    await fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockItemData.qid);
  });

  it('handles missing optional props gracefully (e.g., description, aliases)', () => {
    render(<ItemHeader 
      label="Minimal Item" 
      qid="Q999" 
    />);

    expect(screen.getByText("Minimal Item")).toBeInTheDocument();
    expect(screen.getByText("(Q999)")).toBeInTheDocument();
    // Check that elements for optional props are not rendered or handled without error
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument(); // Assuming no default/placeholder description
    expect(screen.queryByText(/Aliases:/i)).not.toBeInTheDocument();
  });
});
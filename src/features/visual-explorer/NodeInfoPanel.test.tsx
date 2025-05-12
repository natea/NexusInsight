import { render, screen } from '@testing-library/react';
import NodeInfoPanel from './NodeInfoPanel';
import { describe, it, expect, vi } from 'vitest';

describe('NodeInfoPanel', () => {
  it('renders a message when no node is selected and not loading', () => {
    const mockOnClose = vi.fn();
    render(<NodeInfoPanel selectedNode={null} isLoading={false} onClose={mockOnClose} />);
    const messageElement = screen.getByText(/click on a node in the graph to see its details here./i);
    expect(messageElement).toBeInTheDocument();
  });

  // Add more tests here for functionality like:
  // - Displaying information about a selected node
  // - Handling a close action
});
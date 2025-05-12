import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // Needed if HomePage uses Link or other router components

describe('HomePage', () => {
  it('renders a welcome message or main content', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    // Adjust the expected text based on actual HomePage content
    const welcomeMessage = screen.getByText(/welcome to nexusinsight/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  // Add more tests here for functionality like:
  // - Navigation links to other pages (Search, Explorer)
  // - Display of introductory content or key features
});
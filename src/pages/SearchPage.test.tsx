import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // If SearchPage uses routing context
import SearchPage from './SearchPage';
import { server } from '../mocks/server'; // MSW server
import { http, HttpResponse } from 'msw'; // For overriding handlers

// Helper function to wrap component with Router if needed
const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: MemoryRouter });
};

describe('SearchPage Integration Tests', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('renders SearchInput and handles a successful search', async () => {
    renderWithRouter(<SearchPage />);

    const searchInput = screen.getByPlaceholderText(/search nexusinsight.../i);
    fireEvent.change(searchInput, { target: { value: 'Berlin' } });
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    expect(screen.getByText(/loading search results.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading search results.../i)).not.toBeInTheDocument();
      // Updated to match new mock response structure (label instead of title)
      expect(screen.getByText(/berlin for "berlin"/i)).toBeInTheDocument();
      expect(screen.getByText(/capital of germany/i)).toBeInTheDocument();
    });
  });

  test('handles search returning no results', async () => {
    server.use(
      http.get('/api/v1/search', ({ request }) => {
        const url = new URL(request.url);
        const query = url.searchParams.get('q'); // Changed to 'q'
        if (query === 'emptyquery') {
          return HttpResponse.json({ results: [] }); // Ensure response is an object with results array
        }
        // Default fallback if query doesn't match 'emptyquery'
        return HttpResponse.json({ results: [{ qid: 'default', label: 'Default', description: 'Default desc' }] });
      })
    );

    renderWithRouter(<SearchPage />);
    const searchInput = screen.getByPlaceholderText(/search nexusinsight.../i);
    fireEvent.change(searchInput, { target: { value: 'emptyquery' } });
    const searchButtonEmpty = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButtonEmpty);

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  test('handles search API error', async () => {
    server.use(
      http.get('/api/v1/search', () => { // Removed request param as it's not used
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
      })
    );

    renderWithRouter(<SearchPage />);
    const searchInput = screen.getByPlaceholderText(/search nexusinsight.../i);
    fireEvent.change(searchInput, { target: { value: 'triggererror' } });
    const searchButtonError = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButtonError);

    await waitFor(() => {
      // Updated error message to match SearchPage.tsx
      expect(screen.getByText(/error: Search API error: Internal Server Error/i)).toBeInTheDocument();
    });
  });

  test('selects an item from search results and displays its details', async () => {
    renderWithRouter(<SearchPage />);

    const searchInput = screen.getByPlaceholderText(/search nexusinsight.../i);
    fireEvent.change(searchInput, { target: { value: 'Berlin' } });
    const searchButtonDetails = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButtonDetails);

    await waitFor(() => {
      expect(screen.getByText(/berlin for "berlin"/i)).toBeInTheDocument();
    });

    const berlinResult = screen.getByText(/berlin for "berlin"/i);
    fireEvent.click(berlinResult);

    expect(screen.getByText(/loading item details.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading item details.../i)).not.toBeInTheDocument();
      // Check for elements from ItemDetailView based on updated mock data for Q64
      expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'h2' && content.startsWith('Berlin (Q64)'))).toBeInTheDocument(); // Item Label and QID
      expect(screen.getByText('Capital and largest city of Germany')).toBeInTheDocument(); // Item Description
      
      // Check for Key Facts
      expect(screen.getByText('Key Facts')).toBeInTheDocument();
      expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'strong' && content.includes('instance of (P31)'))).toBeInTheDocument();
      expect(screen.getByText('capital city')).toBeInTheDocument(); // Value for 'instance of'
      expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'strong' && content.includes('country (P17)'))).toBeInTheDocument();
      expect(screen.getByText('Germany')).toBeInTheDocument(); // Value for 'country'

      // Check for Statements
      expect(screen.getByText('All Statements')).toBeInTheDocument();
      expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'h4' && content.includes('capital of (P36)'))).toBeInTheDocument();
      expect(screen.getAllByText('Germany').length).toBeGreaterThanOrEqual(1); // Germany appears as value for 'capital of' and 'country'

      // Check for image (alt text)
      const image = screen.getByRole('img', { name: /brandenburg gate at night/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Brandenburger_Tor_abends.jpg/800px-Brandenburger_Tor_abends.jpg');
      
      // Check for Wikidata link
      expect(screen.getByRole('link', { name: /view on wikidata\.org/i })).toHaveAttribute('href', 'https://www.wikidata.org/wiki/Q64');
    }, { timeout: 3000 });
  });

  test('handles item fetch API error', async () => {
    server.use(
      // Ensure the search endpoint returns an item that will cause an error when fetched
      http.get('/api/v1/search', () => {
        return HttpResponse.json({ results: [{ qid: 'item-error', label: 'Item that will error', description: 'Click me for error' }] });
      })
    );
    // 'item-error' is configured in the main handlers.ts to return a 500 error for the /api/v1/item/:qid endpoint

    renderWithRouter(<SearchPage />);
    const searchInput = screen.getByPlaceholderText(/search nexusinsight.../i);
    fireEvent.change(searchInput, { target: { value: 'anysearch' } });
    const searchButtonItemError = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButtonItemError);

    await waitFor(() => {
      expect(screen.getByText(/item that will error/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/item that will error/i));

    await waitFor(() => {
      // Error message from ItemDetailView + error from SearchPage's handleSelectItem
      expect(screen.getByText(/Error loading item: Item fetch API error: Simulated Item Fetch Error/i)).toBeInTheDocument();
    });
  });

  test('closes item detail view', async () => {
    renderWithRouter(<SearchPage />);
    const searchInput = screen.getByPlaceholderText(/search nexusinsight.../i);
    fireEvent.change(searchInput, { target: { value: 'Berlin' } }); // Search for Berlin to get Q64
    const searchButtonClose = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButtonClose);

    await waitFor(() => screen.getByText(/berlin for "berlin"/i)); // Wait for search result
    fireEvent.click(screen.getByText(/berlin for "berlin"/i)); // Click the result

    // Wait for detail view to load (check for Q64's specific description)
    await waitFor(() => screen.getByText('Capital and largest city of Germany'));

    const closeButton = screen.getByRole('button', { name: /close details/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      // Check that specific details from Q64 are gone
      expect(screen.queryByText('Capital and largest city of Germany')).not.toBeInTheDocument();
      expect(screen.queryByText((content, element) => element?.tagName.toLowerCase() === 'h2' && content.startsWith('Berlin (Q64)'))).not.toBeInTheDocument();
    });
    // Ensure search results are still visible
    expect(screen.getByText(/berlin for "berlin"/i)).toBeInTheDocument();
  });

});
import React from 'react';

// Define a basic type for a search result item
// This should be expanded based on the actual data structure
interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
  // Add other relevant fields
}

interface SearchResultsDisplayProps {
  results: SearchResultItem[];
  isLoading: boolean;
  error?: string | null;
  onSelectItem: (itemId: string) => void;
}

const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({
  results,
  isLoading,
  error,
  onSelectItem,
}) => {
  if (isLoading) {
    return <div>Loading search results...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div className="search-results-container">
      <h2>Search Results</h2>
      <ul className="search-results-list">
        {results.map((item) => (
          <li key={item.id} onClick={() => onSelectItem(item.id)} className="search-result-item">
            <h3>{item.title}</h3>
            {item.description && <p>{item.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsDisplay;
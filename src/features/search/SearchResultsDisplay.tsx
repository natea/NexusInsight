import React from 'react';

// Define a basic type for a search result item
// This should be expanded based on the actual data structure
export interface SearchResultItem { // Exporting for potential reuse
  qid: string; // Changed from id to qid
  label: string; // Changed from title to label
  description?: string;
  thumbnail_url?: string; // Added as per spec
  // Add other relevant fields
}

interface SearchResultsDisplayProps {
  results: SearchResultItem[];
  isLoading: boolean;
  error?: string | null;
  onSelectItem: (itemId: string) => void; // itemId is qid
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
          <li key={item.qid} onClick={() => onSelectItem(item.qid)} className="search-result-item">
            {item.thumbnail_url && <img src={item.thumbnail_url} alt={item.label} className="search-result-thumbnail" />}
            <div>
              <h3>{item.label}</h3>
              {item.description && <p>{item.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsDisplay;
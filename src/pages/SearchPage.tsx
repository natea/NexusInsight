import React, { useState } from 'react';
import SearchInput from '../features/search/SearchInput';
import SearchResultsDisplay from '../features/search/SearchResultsDisplay';
import ItemDetailView from '../features/search/ItemDetailView';

// Type definitions aligned with the refined specification (docs/specs/refined/IntelligentSearchAndComprehensiveItemDisplay_refined_overview.md)

export interface SearchResultItem {
  qid: string; // QID, changed from id for clarity
  label: string; // Label, changed from title for clarity
  description?: string;
  thumbnail_url?: string; // As per spec example
}

export interface LanguageInfo {
  label_lang: string;
  description_lang: string;
}

export interface ImageInfo {
  url: string;
  alt_text_default?: string; // As per spec example
}

// Represents the value of a statement, which can be a literal or another item.
export interface StatementValue {
  value_qid?: string; // QID if the value is an item
  value_label?: string; // Label if the value is an item
  value_string?: string; // If the value is a string literal
  value_time?: string; // If the value is a time literal
  value_is_item: boolean; // Discriminator
  // Add other literal types as needed (e.g., value_coordinate, value_quantity)
}

// Represents a key fact, simplified for prominent display.
export interface KeyFact extends StatementValue {
  property_pid: string;
  property_label: string;
}

// Represents a full statement, including qualifiers (not fully typed here for brevity).
export interface Statement extends KeyFact {
  qualifiers?: any[]; // Define more specific type for qualifiers if needed
}

export interface ItemData {
  qid: string; // Changed from id
  label: string; // Changed from title
  description: string;
  aliases?: string[];
  language_info?: LanguageInfo; // Added as per spec
  image_info?: ImageInfo; // Added as per spec, replacing imageUrl
  wikidata_url?: string; // Changed from wikidataUrl for consistency
  key_facts?: KeyFact[]; // Added as per spec
  statements?: Record<string, Statement[]>; // Grouped by PID, as per spec
  // Removed properties and connections, replaced by key_facts and statements
}


const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [currentItemData, setCurrentItemData] = useState<ItemData | null>(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setIsLoadingSearch(true);
    setSearchError(null);
    setSelectedItemId(null); // Clear previous selection
    setCurrentItemData(null); // Clear previous item data
    console.log('Searching for:', query);
    try {
      const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`); // Changed 'query' to 'q'
      if (!response.ok) {
        throw new Error(`Search API error: ${response.statusText}`);
      }
      const data: { results: SearchResultItem[] } = await response.json(); // Expect an object with a 'results' property
      setSearchResults(data.results); // Access the 'results' array
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'An unknown error occurred during search.');
      setSearchResults([]);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const handleSelectItem = async (itemId: string) => {
    setSelectedItemId(itemId);
    setIsLoadingItem(true);
    setItemError(null);
    console.log('Fetching details for item:', itemId);
    try {
      const response = await fetch(`/api/v1/item/${itemId}`);
      if (!response.ok) {
        throw new Error(`Item fetch API error: ${response.statusText}`);
      }
      const data: ItemData = await response.json();
      setCurrentItemData(data);
    } catch (err) {
      setItemError(err instanceof Error ? err.message : 'An unknown error occurred while fetching item details.');
      setCurrentItemData(null);
    } finally {
      setIsLoadingItem(false);
    }
  };

  const handleCloseDetailView = () => {
    setSelectedItemId(null);
    setCurrentItemData(null);
  }

  return (
    <div className="search-page">
      <h1>Intelligent Search</h1>
      <SearchInput onSearch={handleSearch} />
      <div className="search-content-layout">
        <div className="search-results-panel">
          <SearchResultsDisplay
            results={searchResults}
            isLoading={isLoadingSearch}
            error={searchError}
            onSelectItem={handleSelectItem}
          />
        </div>
        {selectedItemId && (
          <div className="item-detail-panel">
            <ItemDetailView
              itemId={selectedItemId}
              itemData={currentItemData}
              isLoading={isLoadingItem}
              error={itemError}
              onClose={handleCloseDetailView}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
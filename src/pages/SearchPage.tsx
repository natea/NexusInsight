import React, { useState } from 'react';
import SearchInput from '../features/search/SearchInput';
import SearchResultsDisplay from '../features/search/SearchResultsDisplay';
import ItemDetailView from '../features/search/ItemDetailView';

// Placeholder types - align with actual data structures
interface SearchResultItem {
  id: string;
  title: string;
  description?: string;
}

interface ItemData {
  id: string;
  title: string;
  description: string;
  properties?: Record<string, any>;
  connections?: Array<{ id: string; type: string; targetTitle: string }>;
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      // Replace with actual API call to your search service
      if (query.toLowerCase().includes('error')) {
        throw new Error('Simulated search API error');
      }
      const mockResults: SearchResultItem[] = [
        { id: 'item1', title: `Result 1 for "${query}"`, description: 'Description for item 1' },
        { id: 'item2', title: `Result 2 for "${query}"`, description: 'Description for item 2' },
        { id: 'item3', title: `Result 3 for "${query}"` },
      ];
      setSearchResults(mockResults);
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    try {
      // Replace with actual API call to fetch item details
      if (itemId === 'item-error') {
        throw new Error('Simulated item fetch error');
      }
      const mockItemData: ItemData = {
        id: itemId,
        title: `Details for Item ${itemId}`,
        description: `This is a detailed description for item ${itemId}. It contains various attributes and connections.`,
        properties: {
          'Created Date': '2024-01-15',
          'Category': 'Sample Data',
          'Status': 'Active',
        },
        connections: [
          { id: 'conn1', type: 'related_to', targetTitle: 'Another Item A' },
          { id: 'conn2', type: 'depends_on', targetTitle: 'Core Component B' },
        ],
      };
      setCurrentItemData(mockItemData);
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
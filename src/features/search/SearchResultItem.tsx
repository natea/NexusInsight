import React from 'react';

interface SearchResult {
  id: string;
  label: string;
  description?: string;
  thumbnailUrl?: string;
}

interface SearchResultItemProps {
  item: SearchResult;
  onClick?: (id: string) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item.id);
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {item.thumbnailUrl && <img src={item.thumbnailUrl} alt={item.label} />}
      <h3>{item.label}</h3>
      {item.description && <p>{item.description}</p>}
    </div>
  );
};

export default SearchResultItem;
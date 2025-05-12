import React from 'react';

interface Suggestion {
  id: string;
  label: string;
  description?: string;
}

interface SuggestionsDropdownProps {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  isLoading: boolean;
  error: string | null;
}

const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({
  suggestions,
  onSelect,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return <div role="status">Loading...</div>;
  }

  if (error) {
    return <div role="alert">{error}</div>;
  }

  if (suggestions.length === 0) {
    return <div>No suggestions found.</div>;
  }

  return (
    <ul role="list">
      {suggestions.map((suggestion) => (
        <li
          key={suggestion.id}
          onClick={() => onSelect(suggestion)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSelect(suggestion);
            }
          }}
          tabIndex={0}
          role="listitem"
          style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
        >
          <div>{suggestion.label}</div>
          {suggestion.description && <div>{suggestion.description}</div>}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsDropdown;
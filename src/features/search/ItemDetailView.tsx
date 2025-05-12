import React, { useState } from 'react';
import { ItemData, KeyFact, StatementValue } from '../../pages/SearchPage'; // Import types
import StatementsRelationshipsSection from './StatementsRelationshipsSection'; // Import the dedicated component

// Helper to render statement values for KeyFacts, can be moved to utils if shared more broadly
const renderKeyFactValue = (value: StatementValue) => {
  if (value.value_is_item && value.value_qid && value.value_label) {
    return value.value_label;
  }
  if (value.value_string) {
    return value.value_string;
  }
  if (value.value_time) {
    return new Date(value.value_time).toLocaleDateString();
  }
  return 'N/A';
};

interface ItemDetailViewProps {
  itemId: string | null; // This is the qid
  itemData: ItemData | null;
  isLoading: boolean;
  error?: string | null;
  onClose?: () => void;
}

const ItemDetailView: React.FC<ItemDetailViewProps> = ({
  itemId, // qid
  itemData,
  isLoading,
  error,
  onClose,
}) => {
  // expandedQualifiers and toggleQualifiers state and function are removed
  // as this logic is now handled by StatementsRelationshipsSection.

  if (isLoading) {
    return <div>Loading item details...</div>;
  }

  if (error) {
    return <div className="error-message">Error loading item: {error}</div>;
  }

  if (!itemId || !itemData) {
    // This state should ideally be handled by the parent,
    // e.g., not rendering ItemDetailView if there's no selected item.
    // However, providing a fallback message here is safe.
    return <div>No item selected or data available.</div>;
  }

  return (
    <div className="item-detail-view">
      {onClose && (
        <button onClick={onClose} className="close-button" aria-label="Close details">
          &times;
        </button>
      )}
      <header className="item-header">
        <h2>{itemData.label} <span className="item-qid">({itemData.qid})</span></h2>
        {itemData.language_info && (
          <p className="language-info">
            (Label: {itemData.language_info.label_lang}, Description: {itemData.language_info.description_lang})
          </p>
        )}
        <p className="item-description">{itemData.description}</p>
        {itemData.aliases && itemData.aliases.length > 0 && (
          <p className="item-aliases"><strong>Aliases:</strong> {itemData.aliases.join(', ')}</p>
        )}
      </header>

      {itemData.image_info && (
        <div className="item-image-section">
          <img src={itemData.image_info.url} alt={itemData.image_info.alt_text_default || itemData.label} />
        </div>
      )}

      {itemData.key_facts && itemData.key_facts.length > 0 && (
        <div className="item-key-facts">
          <h3>Key Facts</h3>
          <ul>
            {itemData.key_facts.map((fact: KeyFact, index: number) => (
              <li key={`${fact.property_pid}-${index}`}>
                <strong>{fact.property_label} ({fact.property_pid}):</strong> {renderKeyFactValue(fact)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delegate rendering of statements and qualifiers to StatementsRelationshipsSection */}
      <StatementsRelationshipsSection
        title="All Statements"
        statements={itemData.statements}
      />

      {itemData.wikidata_url && (
        <div className="item-metadata-links">
          <a href={itemData.wikidata_url} target="_blank" rel="noopener noreferrer">
            View on Wikidata.org
          </a>
        </div>
      )}
    </div>
  );
};

export default ItemDetailView;
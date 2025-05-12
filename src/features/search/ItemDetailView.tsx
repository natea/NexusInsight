import React from 'react';
import { ItemData, KeyFact, Statement, StatementValue } from '../../pages/SearchPage'; // Import types

// Helper to render statement values, which could be links or literals
const renderStatementValue = (value: StatementValue) => {
  if (value.value_is_item && value.value_qid && value.value_label) {
    // In a real app, this could be a link to another item page:
    // return <a href={`/item/${value.value_qid}`}>{value.value_label}</a>;
    return value.value_label;
  }
  if (value.value_string) {
    return value.value_string;
  }
  if (value.value_time) {
    // Format time appropriately
    return new Date(value.value_time).toLocaleDateString();
  }
  // Add rendering for other types like coordinates, quantities etc.
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
                <strong>{fact.property_label} (P{fact.property_pid}):</strong> {renderStatementValue(fact)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {itemData.statements && Object.keys(itemData.statements).length > 0 && (
        <div className="item-statements">
          <h3>All Statements</h3>
          {Object.entries(itemData.statements).map(([pid, statements]: [string, Statement[]]) => (
            <div key={pid} className="statement-group">
              <h4>{statements[0]?.property_label || `Property P${pid}`} (P{pid})</h4>
              <ul>
                {statements.map((statement: Statement, index: number) => (
                  <li key={`${pid}-${statement.value_qid || statement.value_string || index}`}>
                    {renderStatementValue(statement)}
                    {/* TODO: Render qualifiers if needed */}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

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
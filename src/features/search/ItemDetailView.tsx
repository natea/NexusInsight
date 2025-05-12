import React from 'react';

// This should be expanded based on the actual data structure of an item
interface ItemData {
  id: string;
  title: string;
  description: string;
  // Example: properties, connections, metadata
  properties?: Record<string, any>;
  connections?: Array<{ id: string; type: string; targetTitle: string }>;
  // Add other relevant fields
}

interface ItemDetailViewProps {
  itemId: string | null;
  // Function to fetch item data - to be implemented in a service
  // For now, we'll use placeholder data or pass it directly
  itemData: ItemData | null; // In a real app, this would likely be fetched
  isLoading: boolean;
  error?: string | null;
  onClose?: () => void; // Optional: if this view is a modal or overlay
}

const ItemDetailView: React.FC<ItemDetailViewProps> = ({
  itemId,
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
    return <div>Select an item to see details.</div>;
  }

  return (
    <div className="item-detail-view">
      {onClose && (
        <button onClick={onClose} className="close-button" aria-label="Close details">
          &times;
        </button>
      )}
      <h2>{itemData.title}</h2>
      <p>{itemData.description}</p>

      {itemData.properties && (
        <div className="item-properties">
          <h3>Properties</h3>
          <ul>
            {Object.entries(itemData.properties).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {JSON.stringify(value)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {itemData.connections && itemData.connections.length > 0 && (
        <div className="item-connections">
          <h3>Connections</h3>
          <ul>
            {itemData.connections.map((conn) => (
              <li key={conn.id}>
                {conn.type}: {conn.targetTitle} (ID: {conn.id})
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Placeholder for more detailed information or actions */}
    </div>
  );
};

export default ItemDetailView;
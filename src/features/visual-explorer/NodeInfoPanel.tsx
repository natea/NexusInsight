import React from 'react';

// Placeholder type for node data - align with GraphCanvas's NodeData and ItemDetailView's ItemData
interface NodeDetails {
  id: string;
  label: string;
  type?: string;
  properties?: Record<string, any>;
  // Add other relevant details
}

interface NodeInfoPanelProps {
  selectedNode: NodeDetails | null; // Data of the currently selected node
  isLoading: boolean;
  error?: string | null;
  onClose?: () => void; // To close or hide the panel
}

const NodeInfoPanel: React.FC<NodeInfoPanelProps> = ({
  selectedNode,
  isLoading,
  error,
  onClose,
}) => {
  if (isLoading) {
    return <div className="node-info-panel loading">Loading node details...</div>;
  }

  if (error) {
    return <div className="node-info-panel error">Error: {error}</div>;
  }

  if (!selectedNode) {
    return (
      <div className="node-info-panel placeholder">
        <p>Click on a node in the graph to see its details here.</p>
      </div>
    );
  }

  return (
    <aside className="node-info-panel active" role="complementary" aria-label="Node details">
      {onClose && (
        <button onClick={onClose} className="close-button" aria-label="Close node details">
          &times;
        </button>
      )}
      <h3>Node Details: {selectedNode.label}</h3>
      <p><strong>ID:</strong> {selectedNode.id}</p>
      {selectedNode.type && <p><strong>Type:</strong> {selectedNode.type}</p>}

      {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 && (
        <div className="node-properties">
          <h4>Properties:</h4>
          <ul>
            {Object.entries(selectedNode.properties).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {JSON.stringify(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Add more details or actions related to the node */}
    </aside>
  );
};

export default NodeInfoPanel;
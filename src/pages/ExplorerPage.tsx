import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GraphCanvas from '../features/visual-explorer/GraphCanvas';
import NodeInfoPanel from '../features/visual-explorer/NodeInfoPanel';
import Tooltip from '../features/visual-explorer/components/Tooltip'; // Import Tooltip
import { useTooltip } from '../features/visual-explorer/hooks/useTooltip'; // Import useTooltip

// Placeholder types - align with actual data structures
interface NodeData {
  id: string;
  label: string;
  group_name?: string; // Added for clustering
  isCentral?: boolean; // To identify the central node
  description?: string; // For tooltip content
  // other properties for Cytoscape
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
  // other properties for Cytoscape
}

interface RelationshipGroup {
  name: string;
  count: number;
  propertyId: string;
  propertyLabel: string;
}

interface NodeDetails { // For NodeInfoPanel
  id: string;
  label: string;
  type?: string;
  properties?: Record<string, any>;
}

const ExplorerPage: React.FC = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [relationshipGroups, setRelationshipGroups] = useState<RelationshipGroup[]>([]);
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<NodeDetails | null>(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [isLoadingNodeInfo, setIsLoadingNodeInfo] = useState(false);
  const [nodeInfoError, setNodeInfoError] = useState<string | null>(null);
  const { entityId } = useParams<{ entityId: string }>();
  const navigate = useNavigate();
  const { tooltipPosition, tooltipVisible, showTooltip, hideTooltip } = useTooltip();

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!entityId) {
        setGraphError('Entity ID is missing.');
        setIsLoadingGraph(false);
        return;
      }
      setIsLoadingGraph(true);
      setGraphError(null);
      console.log(`Fetching initial graph data for ${entityId}...`);
      try {
        // TODO: Use a proper base URL from config or environment variable
        const response = await fetch(`/api/entity/${entityId}/connections?depth=1&common_groups=true`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Assuming data structure: { centralEntity: {...}, nodes: [], edges: [], relationshipGroups: [] }
        // And that GraphCanvas expects nodes and edges directly.
        // The centralEntity might be used to highlight the main node or for NodeInfoPanel initially.
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setRelationshipGroups(data.relationshipGroups || []); // Store relationship groups
        // Optionally, set selectedNodeDetails if the central entity's info should be shown initially
        if (data.centralEntity) {
            setSelectedNodeDetails({
                id: data.centralEntity.id,
                label: data.centralEntity.label,
                type: data.centralEntity.type || 'Entity', // Adjust as needed
                properties: data.centralEntity.properties || {}, // Adjust as needed
            });
        }

      } catch (err) {
        console.error("Error fetching initial graph data:", err);
        // Ensure the error message matches the test expectation for TC_NEG_002
        setGraphError('Failed to load graph data.');
      } finally {
        setIsLoadingGraph(false);
      }
    };
    fetchInitialData();
  }, [entityId]);

  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked, navigating to focus on:', nodeId);
    // Navigate to the new entity's explorer page.
    // The main useEffect will then pick up the new entityId from useParams
    // and fetch the graph data, including updating selectedNodeDetails for the panel.
    if (nodeId !== entityId) { // Avoid redundant navigation/reload if same node is clicked
        navigate(`/explorer/${nodeId}`);
    } else {
        // If same node is clicked, maybe just ensure its info is loaded/visible
        // For now, the main useEffect handles initial load of selectedNodeDetails
        // If it's already the central node, its details should be there.
        // If not, this click could trigger a detail fetch if not already loaded.
        // However, the current design of main useEffect already sets selectedNodeDetails.
        console.log("Clicked node is already the central entity. Details should be visible.");
        // Optionally, force re-fetch details if needed, but main useEffect should cover it.
        // For simplicity, we assume main useEffect handles setting selectedNodeDetails correctly.
    }
  };

  const handleNodeHover = useCallback((nodeId: string, event: React.MouseEvent<HTMLElement>) => { // Changed MouseEvent to React.MouseEvent<HTMLElement>
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      // Position tooltip near the mouse cursor
      // Adjust X and Y if you want an offset from the cursor
      showTooltip(event.clientX, event.clientY, (
        <>
          <strong>{node.label}</strong>
          {node.description && <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>{node.description}</p>}
        </>
      ));
    }
  }, [nodes, showTooltip]);

  const handleNodeMouseOut = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  const handleCloseNodeInfo = () => {
    setSelectedNodeDetails(null);
  };

  if (isLoadingGraph) {
    return <div>Loading graph explorer...</div>;
  }

  if (graphError) {
    return <div className="error-message">Error loading graph: {graphError}</div>;
  }

  return (
    <div className="explorer-page">
      <h1>Interactive Visual Explorer</h1>
      <div className="explorer-layout">
        <div className="graph-panel" style={{ flexGrow: 1, marginRight: '20px' }}>
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            relationshipGroups={relationshipGroups} // Pass relationshipGroups
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover} // Pass hover handlers
            onNodeMouseOut={handleNodeMouseOut} // Pass mouse out handler
          />
        </div>
        <div className="info-panel" style={{ minWidth: '300px', flexShrink: 0 }}>
          <NodeInfoPanel
            selectedNode={selectedNodeDetails}
            isLoading={isLoadingNodeInfo}
            error={nodeInfoError}
            onClose={handleCloseNodeInfo}
          />
        </div>
      </div>
      <Tooltip visible={tooltipVisible} position={tooltipPosition} />
    </div>
  );
};

export default ExplorerPage;
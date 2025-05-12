import React, { useState, useEffect } from 'react';
import GraphCanvas from '../features/visual-explorer/GraphCanvas';
import NodeInfoPanel from '../features/visual-explorer/NodeInfoPanel';

// Placeholder types - align with actual data structures
interface NodeData {
  id: string;
  label: string;
  // other properties for Cytoscape
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
  // other properties for Cytoscape
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
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<NodeDetails | null>(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [isLoadingNodeInfo, setIsLoadingNodeInfo] = useState(false);
  const [nodeInfoError, setNodeInfoError] = useState<string | null>(null);

  // Simulate fetching initial graph data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingGraph(true);
      setGraphError(null);
      console.log('Fetching initial graph data...');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      try {
        // Replace with actual API call to fetch graph data
        const mockNodes: NodeData[] = [
          { id: 'n1', label: 'Nexus Alpha' },
          { id: 'n2', label: 'Insight Beta' },
          { id: 'n3', label: 'Connection Gamma' },
          { id: 'n4', label: 'Data Point Delta' },
        ];
        const mockEdges: EdgeData[] = [
          { id: 'e1', source: 'n1', target: 'n2', label: 'connects to' },
          { id: 'e2', source: 'n1', target: 'n3', label: 'related to' },
          { id: 'e3', source: 'n2', target: 'n4' },
          { id: 'e4', source: 'n3', target: 'n4', label: 'influences' },
        ];
        setNodes(mockNodes);
        setEdges(mockEdges);
      } catch (err) {
        setGraphError(err instanceof Error ? err.message : 'Failed to load graph data.');
      } finally {
        setIsLoadingGraph(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleNodeClick = async (nodeId: string) => {
    console.log('Node clicked:', nodeId);
    setSelectedNodeDetails(null); // Clear previous
    setIsLoadingNodeInfo(true);
    setNodeInfoError(null);
    // Simulate fetching detailed node info
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      // Replace with actual API call
      const clickedNode = nodes.find(n => n.id === nodeId);
      if (!clickedNode) throw new Error('Node data not found');

      const mockDetails: NodeDetails = {
        id: nodeId,
        label: clickedNode.label,
        type: `Type ${nodeId.toUpperCase()}`,
        properties: {
          'Detail A': `Value for ${nodeId}-A`,
          'Metric B': Math.random() * 100,
          'Status': 'Active',
        },
      };
      setSelectedNodeDetails(mockDetails);
    } catch (err) {
      setNodeInfoError(err instanceof Error ? err.message : 'Failed to load node details.');
    } finally {
      setIsLoadingNodeInfo(false);
    }
  };

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
          <GraphCanvas nodes={nodes} edges={edges} onNodeClick={handleNodeClick} />
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
    </div>
  );
};

export default ExplorerPage;
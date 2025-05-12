import React, { useEffect, useRef } from 'react';
// import cytoscape from 'cytoscape'; // To be uncommented when Cytoscape.js is integrated

// Placeholder types - to be refined with actual data structures
interface NodeData {
  id: string;
  label: string;
  description?: string; // For tooltip content
  group_name?: string; // Added for clustering
  isCentral?: boolean; // To identify the central node
  // other properties
}

interface EdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
  // other properties
}

interface RelationshipGroup { // Added for clustering
  name: string;
  count: number;
  propertyId: string;
  propertyLabel: string;
}

interface GraphCanvasProps {
  nodes: NodeData[];
  edges: EdgeData[];
  relationshipGroups?: RelationshipGroup[]; // Added for clustering
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
  onNodeHover?: (nodeId: string, event: React.MouseEvent<HTMLLIElement>) => void; // Updated for React event
  onNodeMouseOut?: () => void;
  // Layout options, styles, etc.
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  relationshipGroups, // Added for clustering
  onNodeClick,
  onEdgeClick,
  onNodeHover,
  onNodeMouseOut,
}) => {
  const cyRef = useRef<HTMLDivElement | null>(null);
  // const cyInstanceRef = useRef<cytoscape.Core | null>(null); // To store Cytoscape instance

  useEffect(() => {
    if (cyRef.current) {
      // Cytoscape.js initialization logic will go here
      // For now, it's just a placeholder div
      console.log('GraphCanvas mounted. Nodes:', nodes, 'Edges:', edges);
      // Example:
      // cyInstanceRef.current = cytoscape({
      //   container: cyRef.current,
      //   elements: {
      //     nodes: nodes.map(n => ({ data: n })),
      //     edges: edges.map(e => ({ data: e })),
      //   },
      //   style: [ /* ... cytoscape styles ... */ ],
      //   layout: { name: 'cose' /* or other layouts */ }
      // });

      // cyInstanceRef.current.on('tap', 'node', (event) => {
      //   const nodeId = event.target.id();
      //   if (onNodeClick) onNodeClick(nodeId);
      // });

      // cyInstanceRef.current.on('tap', 'edge', (event) => {
      //   const edgeId = event.target.id();
      //   if (onEdgeClick) onEdgeClick(edgeId);
      // });
    }

    // return () => {
    //   if (cyInstanceRef.current) {
    //     cyInstanceRef.current.destroy();
    //   }
    // };
  }, [nodes, edges, onNodeClick, onEdgeClick, onNodeHover, onNodeMouseOut]); // Added new props to dependencies

  return (
    <div
      ref={cyRef}
      className="graph-canvas-container"
      style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
      aria-label="Interactive graph visualization"
    >
        {/* Cytoscape.js will render here. For testing purposes, display nodes and groups if available. */}
        {relationshipGroups && relationshipGroups.length > 0 && (
          <div>
            <h4>Relationship Groups:</h4>
            <ul aria-label="relationship-group-list">
              {relationshipGroups.map(group => (
                <li key={group.propertyId}>
                  {group.name} ({group.count})
                  <ul aria-label={`nodes-in-group-${group.name.replace(/\s+/g, '-')}`}>
                    {nodes.filter(n => n.group_name === group.name).map(node => (
                      <li
                        key={node.id}
                        onClick={() => onNodeClick && onNodeClick(node.id)}
                        onMouseEnter={(e) => onNodeHover && onNodeHover(node.id, e)}
                        onMouseLeave={() => onNodeMouseOut && onNodeMouseOut()}
                        style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
                      >
                        {node.label} (Part of: {group.name})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
        {nodes && nodes.filter(n => !n.group_name).length > 0 && (
          <div>
            <h4>Other Nodes:</h4>
            <ul aria-label="node-list">
              {nodes.filter(n => !n.group_name).map(node => (
                <li
                  key={node.id}
                  onClick={() => onNodeClick && onNodeClick(node.id)}
                  onMouseEnter={(e) => onNodeHover && onNodeHover(node.id, e)}
                  onMouseLeave={() => onNodeMouseOut && onNodeMouseOut()}
                  style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
                >
                  {node.label} {node.isCentral ? '(Central)' : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(!nodes || nodes.length === 0) && (!relationshipGroups || relationshipGroups.length === 0) && (
          <p style={{ textAlign: 'center', paddingTop: '20px' }}>
            Graph Visualization Area (Cytoscape.js to be integrated)
          </p>
        )}
      </div>
  );
}

export default GraphCanvas;
import React from 'react';
import ReactDOM from 'react-dom'; // For React Portal
import { TooltipPosition } from '../hooks/useTooltip';

interface TooltipProps {
  visible: boolean;
  position: TooltipPosition | null;
  // Children will be passed via position.content
}

const baseTooltipStyle: React.CSSProperties = {
  position: 'fixed', // Use 'fixed' for positioning relative to viewport
  background: 'rgba(0, 0, 0, 0.8)', // Darker, slightly transparent background
  color: '#fff',
  padding: '8px 12px',
  borderRadius: '4px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)', // Softer shadow
  zIndex: 10000, // High z-index to ensure it's on top
  pointerEvents: 'none', // Allow clicks to pass through to elements below
  fontSize: '0.875rem',
  maxWidth: '300px', // Prevent tooltip from becoming too wide
  transition: 'opacity 0.1s ease-in-out', // Smooth fade-in/out
  // opacity will be set based on visibility
};

const TooltipComponent: React.FC<TooltipProps> = ({ visible, position }) => {
  if (!visible || !position) {
    return null;
  }

  const dynamicStyle: React.CSSProperties = {
    ...baseTooltipStyle,
    top: position.top,
    left: position.left,
    opacity: visible ? 1 : 0,
  };

  // Ensure the portal target exists in your public/index.html or App root
  const portalRoot = document.getElementById('tooltip-portal-root');

  if (!portalRoot) {
    console.warn('Tooltip portal root not found. Create a div with id="tooltip-portal-root" in your HTML.');
    // Fallback to rendering inline if portal root doesn't exist, though this might have z-index issues.
    return (
        <div
          style={dynamicStyle} // Use combined style
          role="tooltip"
          aria-live="polite" // Announce changes to screen readers
        >
          {position.content}
        </div>
    );
  }
  
  const portalStyle: React.CSSProperties = {
    ...dynamicStyle,
    transform: 'translate(10px, 10px)', // Offset slightly from cursor
    // If specific transition for transform is needed, it can be merged here or base style updated
    transition: `${baseTooltipStyle.transition}, transform 0.1s ease-in-out`,
  };

  return ReactDOM.createPortal(
    <div
      style={portalStyle} // Use combined and extended style for portal
      role="tooltip"
      aria-live="polite"
    >
      {position.content}
    </div>,
    portalRoot
  );
};

export default React.memo(TooltipComponent);
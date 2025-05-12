import { useState, useCallback } from 'react';

export interface TooltipPosition {
  top: number;
  left: number;
  content: React.ReactNode; // Allow rich content for the tooltip
}

export function useTooltip() {
  const [tooltip, setTooltip] = useState<TooltipPosition | null>(null);
  const [visible, setVisible] = useState(false);

  const showTooltip = useCallback((x: number, y: number, content: React.ReactNode) => {
    setTooltip({ top: y, left: x, content });
    setVisible(true);
  }, []);

  const hideTooltip = useCallback(() => {
    setVisible(false);
    // Optionally reset tooltip content after a delay to prevent flickering if re-hovering quickly
    // setTimeout(() => setTooltip(null), 200); 
  }, []);

  return { tooltipPosition: tooltip, tooltipVisible: visible, showTooltip, hideTooltip };
}
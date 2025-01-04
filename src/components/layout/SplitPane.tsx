import React, { useEffect, useRef, useState, ReactNode } from 'react';
import './SplitPane.css';

export interface SplitPaneProps {
  defaultSize?: number;
  min?: number;
  max?: number;
  split?: 'vertical' | 'horizontal';
  primary?: 'first' | 'second';
  children?: ReactNode;
}

const SplitPane: React.FC<SplitPaneProps> = ({
  defaultSize = 200,
  min = 50,
  max = 500,
  split = 'vertical',
  primary = 'first',
  children
}) => {
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const splitPaneRef = useRef<HTMLDivElement>(null);
  const startPositionRef = useRef(0);
  const startSizeRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPositionRef.current = split === 'vertical' ? e.clientX : e.clientY;
    startSizeRef.current = size;
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !splitPaneRef.current) return;

      const currentPosition = split === 'vertical' ? e.clientX : e.clientY;
      const delta = currentPosition - startPositionRef.current;
      
      let newSize = startSizeRef.current + (primary === 'first' ? delta : -delta);
      newSize = Math.max(min, Math.min(max, newSize));
      setSize(newSize);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, min, max, primary, split]);

  const [firstChild, secondChild] = React.Children.toArray(children);

  const resizeStyle = {
    [split === 'vertical' ? 'width' : 'height']: size,
    [split === 'vertical' ? 'minWidth' : 'minHeight']: min,
    [split === 'vertical' ? 'maxWidth' : 'maxHeight']: max
  };

  return (
    <div
      ref={splitPaneRef}
      className={`split-pane ${split} ${isDragging ? 'dragging' : ''}`}
    >
      <div
        className="pane first"
        style={primary === 'first' ? resizeStyle : undefined}
      >
        {firstChild}
      </div>
      <div
        className="resizer"
        onMouseDown={handleMouseDown}
      />
      <div
        className="pane second"
        style={primary === 'second' ? resizeStyle : undefined}
      >
        {secondChild}
      </div>
    </div>
  );
};

export default SplitPane;
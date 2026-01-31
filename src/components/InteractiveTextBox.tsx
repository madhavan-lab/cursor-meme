import { useState, useRef, useEffect } from 'react';
import { TextBox } from '../types';

interface InteractiveTextBoxProps {
  textBox: TextBox;
  onUpdate: (updated: TextBox) => void;
  onDelete: () => void;
  canvasScale: number;
  canvasOffset: { x: number; y: number };
  isSelected: boolean;
  onSelect: () => void;
}

export default function InteractiveTextBox({
  textBox,
  onUpdate,
  onDelete,
  canvasScale,
  canvasOffset,
  isSelected,
  onSelect,
}: InteractiveTextBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const textBoxRef = useRef<HTMLDivElement>(null);

  // Calculate display position and size
  const displayX = textBox.x * canvasScale;
  const displayY = textBox.y * canvasScale;
  const displayWidth = (textBox.width || 200) * canvasScale;
  const displayHeight = (textBox.height || 100) * canvasScale;

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return; // Let resize handle handle it
    }
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    const container = e.currentTarget.closest('.interactive-text-boxes');
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const relativeY = e.clientY - containerRect.top;
      setDragStart({
        x: relativeX - displayX,
        y: relativeY - displayY,
      });
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: displayWidth,
      height: displayHeight,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && textBoxRef.current) {
        const rect = textBoxRef.current.getBoundingClientRect();
        const container = textBoxRef.current.closest('.interactive-text-boxes');
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const relativeX = e.clientX - containerRect.left - dragStart.x;
          const relativeY = e.clientY - containerRect.top - dragStart.y;
          const newX = Math.max(0, relativeX / canvasScale);
          const newY = Math.max(0, relativeY / canvasScale);
          onUpdate({ ...textBox, x: newX, y: newY });
        }
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(50, (resizeStart.width + deltaX) / canvasScale);
        const newHeight = Math.max(30, (resizeStart.height + deltaY) / canvasScale);
        onUpdate({ ...textBox, width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, canvasScale, textBox, onUpdate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && isSelected) {
      e.preventDefault();
      onDelete();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newText = prompt('Enter text:', textBox.text);
    if (newText !== null) {
      onUpdate({ ...textBox, text: newText });
    }
  };

  return (
    <div
      ref={textBoxRef}
      className={`interactive-text-box ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: `${displayX}px`,
        top: `${displayY}px`,
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'auto',
      }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
    >
      <div
        className="text-box-content"
        style={{
          fontSize: `${textBox.fontSize * canvasScale}px`,
          color: textBox.textColor,
          WebkitTextStroke: `${2 * canvasScale}px ${textBox.borderColor}`,
          textShadow: `${2 * canvasScale}px ${2 * canvasScale}px 0 ${textBox.borderColor}`,
          fontFamily: 'Impact, Arial Black, sans-serif',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          wordWrap: 'break-word',
          overflow: 'hidden',
        }}
      >
        {textBox.text || 'Double click to edit'}
      </div>
      {isSelected && (
        <>
          <div className="resize-handle resize-handle-se" onMouseDown={handleResizeStart} />
          <div className="delete-button" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            ×
          </div>
        </>
      )}
    </div>
  );
}

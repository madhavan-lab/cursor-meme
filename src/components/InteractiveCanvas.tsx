import { useEffect, useRef, useState, forwardRef } from 'react';
import { TextBox } from '../types';

interface InteractiveCanvasProps {
  imageUrl: string | null;
  textBoxes: TextBox[];
  onTextBoxUpdate: (updated: TextBox) => void;
  onTextBoxSelect: (id: string | null) => void;
  selectedTextBoxId: string | null;
}

const InteractiveCanvas = forwardRef<HTMLCanvasElement, InteractiveCanvasProps>(
  ({ imageUrl, textBoxes, onTextBoxUpdate, onTextBoxSelect, selectedTextBoxId }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const internalCanvasRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    // Merge refs
    const setRef = (element: HTMLCanvasElement | null) => {
      internalCanvasRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = element;
      }
    };

    // Draw canvas
    useEffect(() => {
      const canvas = internalCanvasRef.current;
      if (!canvas || !imageUrl) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Calculate scale to fit container
        const container = containerRef.current;
        if (container) {
          const maxWidth = container.clientWidth - 40;
          const maxHeight = window.innerHeight - 200;
          const scaleX = maxWidth / img.width;
          const scaleY = maxHeight / img.height;
          const newScale = Math.min(scaleX, scaleY, 1);
          setScale(newScale);
          setImageDimensions({ width: img.width, height: img.height });
        } else {
          setImageDimensions({ width: img.width, height: img.height });
        }
        
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Draw all text boxes
        textBoxes.forEach((textBox) => {
          if (!textBox.text.trim()) return;

          ctx.font = `${textBox.fontSize}px Impact, Arial Black, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Draw border
          ctx.strokeStyle = textBox.borderColor || 'black';
          ctx.lineWidth = 4;
          ctx.strokeText(textBox.text, textBox.x, textBox.y);

          // Draw text
          ctx.fillStyle = textBox.textColor || 'white';
          ctx.fillText(textBox.text, textBox.x, textBox.y);
        });
      };

      img.onerror = () => {
        console.error('Failed to load image');
      };

      img.src = imageUrl;
    }, [imageUrl, textBoxes]);

    // Get text box bounds for interaction
    const getTextBoxBounds = (textBox: TextBox, ctx: CanvasRenderingContext2D) => {
      ctx.font = `${textBox.fontSize}px Impact, Arial Black, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const metrics = ctx.measureText(textBox.text);
      const width = metrics.width;
      const height = textBox.fontSize;
      return {
        left: textBox.x - width / 2 - 10,
        right: textBox.x + width / 2 + 10,
        top: textBox.y - height / 2 - 10,
        bottom: textBox.y + height / 2 + 10,
        width: width + 20,
        height: height + 20,
      };
    };

    // Convert screen coordinates to canvas coordinates
    const screenToCanvas = (screenX: number, screenY: number) => {
      const canvas = internalCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      
      const rect = canvas.getBoundingClientRect();
      const x = (screenX - rect.left) / scale;
      const y = (screenY - rect.top) / scale;
      return { x, y };
    };

    // Handle mouse down
    const handleMouseDown = (e: React.MouseEvent) => {
      if (!imageUrl) return;
      
      const canvas = internalCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const canvasCoords = screenToCanvas(e.clientX, e.clientY);

      // Check if clicking on a text box
      let clickedTextBox: TextBox | null = null;
      for (let i = textBoxes.length - 1; i >= 0; i--) {
        const textBox = textBoxes[i];
        if (!textBox.text.trim()) continue;
        
        const bounds = getTextBoxBounds(textBox, ctx);

        if (
          canvasCoords.x >= bounds.left &&
          canvasCoords.x <= bounds.right &&
          canvasCoords.y >= bounds.top &&
          canvasCoords.y <= bounds.bottom
        ) {
          clickedTextBox = textBox;
          break;
        }
      }

      if (clickedTextBox) {
        onTextBoxSelect(clickedTextBox.id);
        setIsDragging(true);
        setDragStart({ x: canvasCoords.x - clickedTextBox.x, y: canvasCoords.y - clickedTextBox.y });
      } else {
        onTextBoxSelect(null);
      }
    };

    // Handle mouse move
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !selectedTextBoxId) return;

      const canvasCoords = screenToCanvas(e.clientX, e.clientY);
      const selectedTextBox = textBoxes.find((tb) => tb.id === selectedTextBoxId);
      if (!selectedTextBox) return;

      const newX = Math.max(0, Math.min(imageDimensions.width, canvasCoords.x - dragStart.x));
      const newY = Math.max(0, Math.min(imageDimensions.height, canvasCoords.y - dragStart.y));

      onTextBoxUpdate({
        ...selectedTextBox,
        x: newX,
        y: newY,
      });
    };

    // Handle mouse up
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // Handle font size change via wheel
    useEffect(() => {
      const handleWheel = (e: WheelEvent) => {
        if (!selectedTextBoxId || !e.ctrlKey) return;
        
        e.preventDefault();
        const selectedTextBox = textBoxes.find((tb) => tb.id === selectedTextBoxId);
        if (!selectedTextBox) return;

        const delta = e.deltaY > 0 ? -2 : 2;
        const newFontSize = Math.max(12, Math.min(100, selectedTextBox.fontSize + delta));
        
        onTextBoxUpdate({
          ...selectedTextBox,
          fontSize: newFontSize,
        });
      };

      const overlay = overlayRef.current;
      if (overlay) {
        overlay.addEventListener('wheel', handleWheel, { passive: false });
        return () => overlay.removeEventListener('wheel', handleWheel);
      }
    }, [selectedTextBoxId, textBoxes, onTextBoxUpdate]);

    // Update canvas when text boxes change (for download)
    useEffect(() => {
      const canvas = internalCanvasRef.current;
      if (!canvas || !imageUrl) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        textBoxes.forEach((textBox) => {
          if (!textBox.text.trim()) return;

          ctx.font = `${textBox.fontSize}px Impact, Arial Black, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.strokeStyle = textBox.borderColor || 'black';
          ctx.lineWidth = 4;
          ctx.strokeText(textBox.text, textBox.x, textBox.y);

          ctx.fillStyle = textBox.textColor || 'white';
          ctx.fillText(textBox.text, textBox.x, textBox.y);
        });
      };
      img.src = imageUrl;
    }, [imageUrl, textBoxes]);

    if (!imageUrl) {
      return (
        <div className="canvas-placeholder">
          <div className="placeholder-content">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>Select a template or upload an image to get started</p>
          </div>
        </div>
      );
    }

    return (
      <div className="interactive-canvas-container" ref={containerRef}>
        <div className="canvas-wrapper">
          <canvas
            ref={setRef}
            className="meme-canvas"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
          />
          <div
            ref={overlayRef}
            className="canvas-overlay"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: `${imageDimensions.width}px`,
              height: `${imageDimensions.height}px`,
            }}
          >
            {textBoxes.map((textBox) => {
              if (!textBox.text.trim() || textBox.id !== selectedTextBoxId) return null;
              
              const canvas = internalCanvasRef.current;
              if (!canvas) return null;
              
              const ctx = canvas.getContext('2d');
              if (!ctx) return null;
              
              const bounds = getTextBoxBounds(textBox, ctx);
              
              return (
                <div
                  key={textBox.id}
                  className="text-box-selection"
                  style={{
                    left: `${bounds.left}px`,
                    top: `${bounds.top}px`,
                    width: `${bounds.width}px`,
                    height: `${bounds.height}px`,
                  }}
                >
                  <div className="resize-handle resize-handle-nw" />
                  <div className="resize-handle resize-handle-ne" />
                  <div className="resize-handle resize-handle-sw" />
                  <div className="resize-handle resize-handle-se" />
                </div>
              );
            })}
          </div>
        </div>
        {selectedTextBoxId && (
          <div className="canvas-hint">
            <span>💡 Hold Ctrl + Scroll to resize text</span>
          </div>
        )}
      </div>
    );
  }
);

InteractiveCanvas.displayName = 'InteractiveCanvas';

export default InteractiveCanvas;

import { useEffect, useRef, forwardRef, useState } from 'react';
import { TextBox } from '../types';
import InteractiveTextBox from './InteractiveTextBox';

interface MemeCanvasProps {
  imageUrl: string | null;
  textBoxes: TextBox[];
  selectedTextBoxId?: string | null;
  onTextBoxSelect?: (id: string | null) => void;
  onTextBoxUpdate: (updated: TextBox) => void;
  onTextBoxDelete: (id: string) => void;
}

const MemeCanvas = forwardRef<HTMLCanvasElement, MemeCanvasProps>(
  ({ imageUrl, textBoxes, selectedTextBoxId, onTextBoxSelect, onTextBoxUpdate, onTextBoxDelete }, ref) => {
    const internalCanvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasScale, setCanvasScale] = useState(1);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    
    // Merge refs: use forwarded ref if provided, otherwise use internal ref
    const setRef = (element: HTMLCanvasElement | null) => {
      internalCanvasRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = element;
      }
    };

    // Load image and set canvas dimensions
    useEffect(() => {
      const canvas = internalCanvasRef.current;
      if (!canvas || !imageUrl) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Calculate scale to fit canvas in container
        const updateScale = () => {
          const container = canvas.parentElement?.parentElement; // Get canvas-area
          if (container && canvas.width && canvas.height) {
            const containerRect = container.getBoundingClientRect();
            const maxWidth = containerRect.width - 80; // Padding
            const maxHeight = containerRect.height - 80;
            const scaleX = maxWidth / canvas.width;
            const scaleY = maxHeight / canvas.height;
            const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
            setCanvasScale(scale);
            
            // Center the canvas
            const scaledWidth = canvas.width * scale;
            const scaledHeight = canvas.height * scale;
            const canvasContainer = canvas.parentElement;
            if (canvasContainer) {
              const containerRect = container.getBoundingClientRect();
              const offsetX = (containerRect.width - scaledWidth) / 2;
              const offsetY = (containerRect.height - scaledHeight) / 2;
              setCanvasOffset({ x: offsetX, y: offsetY });
            }
          }
        };

        // Wait a bit for layout to settle
        setTimeout(updateScale, 100);
        const resizeHandler = () => {
          setTimeout(updateScale, 100);
        };
        window.addEventListener('resize', resizeHandler);

        // Draw image
        ctx.drawImage(img, 0, 0);

        return () => {
          window.removeEventListener('resize', resizeHandler);
        };
      };

      img.onerror = () => {
        console.error('Failed to load image');
      };

      img.src = imageUrl;
    }, [imageUrl]);

    // Redraw text boxes whenever they change
    useEffect(() => {
      const canvas = internalCanvasRef.current;
      if (!canvas || !imageUrl) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Reload image and redraw everything
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image
        ctx.drawImage(img, 0, 0);

        // Draw text boxes on canvas
        textBoxes.forEach((textBox) => {
          if (!textBox.text.trim()) return;

          // Set font properties
          ctx.font = `${textBox.fontSize}px Impact, Arial Black, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Draw border (stroke) first
          ctx.strokeStyle = textBox.borderColor || 'black';
          ctx.lineWidth = 4;
          ctx.strokeText(textBox.text, textBox.x, textBox.y);

          // Draw text fill on top
          ctx.fillStyle = textBox.textColor || 'white';
          ctx.fillText(textBox.text, textBox.x, textBox.y);
        });
      };

      img.src = imageUrl;
    }, [imageUrl, textBoxes]);

    if (!imageUrl) {
      return (
        <div className="canvas-placeholder">
          <p>Please select an image to get started</p>
        </div>
      );
    }

  return (
    <div className="canvas-container">
      <canvas 
        ref={setRef} 
        className="meme-canvas"
        style={{
          transform: `scale(${canvasScale})`,
          transformOrigin: 'top left',
        }}
      />
      <div 
        className="interactive-text-boxes"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${canvasScale * (internalCanvasRef.current?.width || 0)}px`,
          height: `${canvasScale * (internalCanvasRef.current?.height || 0)}px`,
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
        }}
      >
        {textBoxes.map((textBox) => (
          <InteractiveTextBox
            key={textBox.id}
            textBox={textBox}
            onUpdate={onTextBoxUpdate}
            onDelete={() => onTextBoxDelete(textBox.id)}
            canvasScale={canvasScale}
            canvasOffset={{ x: 0, y: 0 }}
            isSelected={selectedTextBoxId === textBox.id}
            onSelect={() => onTextBoxSelect?.(textBox.id)}
          />
        ))}
      </div>
    </div>
  );
  }
);

MemeCanvas.displayName = 'MemeCanvas';

export default MemeCanvas;

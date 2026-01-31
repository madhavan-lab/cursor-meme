import { useEffect, useRef, forwardRef } from 'react';
import { TextBox } from '../types';

interface MemeCanvasProps {
  imageUrl: string | null;
  textBoxes: TextBox[];
}

const MemeCanvas = forwardRef<HTMLCanvasElement, MemeCanvasProps>(
  ({ imageUrl, textBoxes }, ref) => {
    const internalCanvasRef = useRef<HTMLCanvasElement>(null);
    
    // Merge refs: use forwarded ref if provided, otherwise use internal ref
    const setRef = (element: HTMLCanvasElement | null) => {
      internalCanvasRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = element;
      }
    };

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

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Draw all text boxes
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

    img.onerror = () => {
      console.error('Failed to load image');
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
      <canvas ref={setRef} className="meme-canvas" />
    </div>
  );
  }
);

MemeCanvas.displayName = 'MemeCanvas';

export default MemeCanvas;

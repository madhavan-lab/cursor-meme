import { useState, useRef } from 'react';
import ImageSelector from './components/ImageSelector';
import InteractiveCanvas from './components/InteractiveCanvas';
import TextBox from './components/TextBox';
import DownloadButton from './components/DownloadButton';
import { TextBox as TextBoxType } from './types';
import './App.css';

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextBoxType[]>([
    { id: '1', text: '', fontSize: 40, x: 0, y: 0, textColor: '#ffffff', borderColor: '#000000' },
  ]);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelect = (url: string) => {
    setImageUrl(url);
    setSelectedTextBoxId(null);
    // Reset text boxes when new image is loaded
    const img = new Image();
    img.onload = () => {
      setTextBoxes([
        {
          id: Date.now().toString(),
          text: '',
          fontSize: 40,
          x: img.width / 2,
          y: img.height / 4,
          textColor: '#ffffff',
          borderColor: '#000000',
        },
      ]);
    };
    img.src = url;
  };

  const handleAddTextBox = () => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      const newTextBox: TextBoxType = {
        id: Date.now().toString(),
        text: '',
        fontSize: 40,
        x: img.width / 2,
        y: img.height / 2,
        textColor: '#ffffff',
        borderColor: '#000000',
      };
      setTextBoxes([...textBoxes, newTextBox]);
      setSelectedTextBoxId(newTextBox.id);
    };
    img.src = imageUrl;
  };

  const handleUpdateTextBox = (updated: TextBoxType) => {
    setTextBoxes(textBoxes.map((tb) => (tb.id === updated.id ? updated : tb)));
  };

  const handleDeleteTextBox = (id: string) => {
    if (textBoxes.length > 1) {
      setTextBoxes(textBoxes.filter((tb) => tb.id !== id));
      if (selectedTextBoxId === id) {
        setSelectedTextBoxId(null);
      }
    }
  };

  const handleTextBoxSelect = (id: string | null) => {
    setSelectedTextBoxId(id);
  };

  // Get canvas dimensions for text box positioning
  const getCanvasDimensions = () => {
    if (!imageUrl) return { width: 0, height: 0 };
    const canvas = canvasRef.current;
    if (canvas) {
      return { width: canvas.width, height: canvas.height };
    }
    return { width: 800, height: 600 };
  };

  const { width: canvasWidth, height: canvasHeight } = getCanvasDimensions();

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 Meme Generator</h1>
      </header>

      <div className="app-content">
        <aside className="sidebar">
          <ImageSelector onImageSelect={handleImageSelect} />

          {imageUrl && (
            <>
              <div className="text-boxes-section">
                <div className="section-header">
                  <h2>Text Boxes</h2>
                  <button
                    onClick={handleAddTextBox}
                    className="add-btn"
                    type="button"
                  >
                    + Add Text Box
                  </button>
                </div>

                {textBoxes.map((textBox) => (
                  <TextBox
                    key={textBox.id}
                    textBox={textBox}
                    onUpdate={handleUpdateTextBox}
                    onDelete={() => handleDeleteTextBox(textBox.id)}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    isSelected={textBox.id === selectedTextBoxId}
                    onSelect={() => handleTextBoxSelect(textBox.id)}
                  />
                ))}
              </div>

              <DownloadButton canvasRef={canvasRef} disabled={!imageUrl} />
            </>
          )}
        </aside>

        <main className="canvas-area">
          <InteractiveCanvas
            ref={canvasRef}
            imageUrl={imageUrl}
            textBoxes={textBoxes}
            onTextBoxUpdate={handleUpdateTextBox}
            onTextBoxSelect={handleTextBoxSelect}
            selectedTextBoxId={selectedTextBoxId}
          />
        </main>
      </div>
    </div>
  );
}

export default App;

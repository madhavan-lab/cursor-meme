import { TextBox as TextBoxType } from '../types';

interface TextBoxProps {
  textBox: TextBoxType;
  onUpdate: (updated: TextBoxType) => void;
  onDelete: () => void;
  canvasWidth: number;
  canvasHeight: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function TextBox({
  textBox,
  onUpdate,
  onDelete,
  canvasWidth,
  canvasHeight,
  isSelected = false,
  onSelect,
}: TextBoxProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...textBox, text: e.target.value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fontSize = parseInt(e.target.value, 10);
    if (!isNaN(fontSize) && fontSize >= 12 && fontSize <= 100) {
      onUpdate({ ...textBox, fontSize });
    }
  };

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const x = parseInt(e.target.value, 10);
    if (!isNaN(x) && x >= 0 && x <= canvasWidth) {
      onUpdate({ ...textBox, x });
    }
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const y = parseInt(e.target.value, 10);
    if (!isNaN(y) && y >= 0 && y <= canvasHeight) {
      onUpdate({ ...textBox, y });
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...textBox, textColor: e.target.value });
  };

  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...textBox, borderColor: e.target.value });
  };

  return (
    <div 
      className={`text-box-controls ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
    >
      <div className="text-box-header">
        <h3>Text Box {isSelected && '✓'}</h3>
        <button onClick={onDelete} className="delete-btn" type="button">
          Delete
        </button>
      </div>

      <div className="control-group">
        <label htmlFor={`text-${textBox.id}`}>Text:</label>
        <input
          id={`text-${textBox.id}`}
          type="text"
          value={textBox.text}
          onChange={handleTextChange}
          placeholder="Enter text here"
          className="text-input"
        />
      </div>

      <div className="control-group">
        <label htmlFor={`fontSize-${textBox.id}`}>
          Font Size: {textBox.fontSize}px
        </label>
        <input
          id={`fontSize-${textBox.id}`}
          type="range"
          min="12"
          max="100"
          value={textBox.fontSize}
          onChange={handleFontSizeChange}
          className="font-size-slider"
        />
      </div>

      <div className="color-controls">
        <div className="control-group">
          <label htmlFor={`textColor-${textBox.id}`}>Text Color:</label>
          <div className="color-input-wrapper">
            <input
              id={`textColor-${textBox.id}`}
              type="color"
              value={textBox.textColor || '#ffffff'}
              onChange={handleTextColorChange}
              className="color-input"
            />
            <input
              type="text"
              value={textBox.textColor || '#ffffff'}
              onChange={handleTextColorChange}
              className="color-text-input"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div className="control-group">
          <label htmlFor={`borderColor-${textBox.id}`}>Border Color:</label>
          <div className="color-input-wrapper">
            <input
              id={`borderColor-${textBox.id}`}
              type="color"
              value={textBox.borderColor || '#000000'}
              onChange={handleBorderColorChange}
              className="color-input"
            />
            <input
              type="text"
              value={textBox.borderColor || '#000000'}
              onChange={handleBorderColorChange}
              className="color-text-input"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div className="position-controls">
        <div className="control-group">
          <label htmlFor={`x-${textBox.id}`}>X Position:</label>
          <input
            id={`x-${textBox.id}`}
            type="number"
            min="0"
            max={canvasWidth}
            value={textBox.x}
            onChange={handleXChange}
            className="position-input"
          />
        </div>

        <div className="control-group">
          <label htmlFor={`y-${textBox.id}`}>Y Position:</label>
          <input
            id={`y-${textBox.id}`}
            type="number"
            min="0"
            max={canvasHeight}
            value={textBox.y}
            onChange={handleYChange}
            className="position-input"
          />
        </div>
      </div>
    </div>
  );
}

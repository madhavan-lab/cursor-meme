import { useState } from 'react';

interface ImageSelectorProps {
  onImageSelect: (imageUrl: string) => void;
}

export default function ImageSelector({ onImageSelect }: ImageSelectorProps) {
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        onImageSelect(result);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the image file');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setError('Please enter an image URL');
      return;
    }

    setError(null);
    // Validate URL by trying to load the image
    const img = new Image();
    img.onload = () => {
      onImageSelect(urlInput);
      setUrlInput('');
    };
    img.onerror = () => {
      setError('Failed to load image from URL. Please check the URL and try again.');
    };
    img.crossOrigin = 'anonymous';
    img.src = urlInput;
  };

  return (
    <div className="image-selector">
      <h2>Select Image</h2>
      
      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-label">
          Upload Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="file-input"
        />
      </div>

      <div className="divider">OR</div>

      <form onSubmit={handleUrlSubmit} className="url-form">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter image URL"
          className="url-input"
        />
        <button type="submit" className="url-submit-btn">
          Load from URL
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

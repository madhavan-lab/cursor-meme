import { useState, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}

interface ImageSelectorProps {
  onImageSelect: (imageUrl: string) => void;
}

export default function ImageSelector({ onImageSelect }: ImageSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'upload'>('templates');
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load templates from JSON file
    fetch('/assets/templates.json')
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load templates:', err);
        setLoading(false);
      });
  }, []);

  const handleTemplateSelect = (template: Template) => {
    setError(null);
    // Validate URL by trying to load the image
    const img = new Image();
    img.onload = () => {
      onImageSelect(template.url);
    };
    img.onerror = () => {
      setError('Failed to load template image. Please try another template.');
    };
    img.crossOrigin = 'anonymous';
    img.src = template.url;
  };

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
      
      <div className="tab-buttons">
        <button
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
          type="button"
        >
          Templates
        </button>
        <button
          className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
          type="button"
        >
          Upload
        </button>
      </div>

      {activeTab === 'templates' && (
        <div className="templates-section">
          {loading ? (
            <div className="loading-state">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="empty-state">No templates available</div>
          ) : (
            <div className="templates-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="template-card"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="template-thumbnail">
                    <img src={template.thumbnail} alt={template.name} />
                    <div className="template-overlay">
                      <span>Use Template</span>
                    </div>
                  </div>
                  <div className="template-name">{template.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="upload-section-content">
          <div className="upload-section">
            <label htmlFor="file-upload" className="upload-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
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
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

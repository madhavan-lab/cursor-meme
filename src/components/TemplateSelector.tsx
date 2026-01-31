interface TemplateSelectorProps {
  onTemplateSelect: (imageUrl: string) => void;
}

// List of available templates from assets folder
const templates = [
  { name: 'HFSS Logo', path: '/assets/hfss-logo@3x.png' },
  { name: 'Hindu Swayamsevak Sangh', path: '/assets/Hindu.Swayamsevak_sangh.png' },
  { name: 'HMUSA Icon', path: '/assets/hmusaIcon.png' },
  { name: 'HMUSA Logo', path: '/assets/hmusalogo.png' },
  { name: 'Generated Image', path: '/assets/generated-image.png' },
];

export default function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps) {
  return (
    <div className="template-selector">
      <h3>Templates</h3>
      <div className="template-grid">
        {templates.map((template, index) => (
          <div
            key={index}
            className="template-item"
            onClick={() => onTemplateSelect(template.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTemplateSelect(template.path);
              }
            }}
          >
            <div className="template-thumbnail">
              <img src={template.path} alt={template.name} loading="lazy" />
            </div>
            <span className="template-name">{template.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

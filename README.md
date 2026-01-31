# Meme Generator

A modern, feature-rich meme generator built with React, TypeScript, and Vite. Create memes by uploading images or using URLs, add customizable text overlays, and download your creations.

## Features

- 🖼️ **Image Selection**: Upload images from your computer or load from URL
- ✏️ **Multiple Text Boxes**: Add and remove text boxes dynamically
- 🎨 **Customizable Colors**: Change text color and border color independently
- 📏 **Font Size Control**: Adjustable font size from 12px to 100px
- 📍 **Position Control**: Precise X/Y positioning for text placement
- 🎨 **Text Styling**: White text with black border (classic meme style) - customizable
- 💾 **Download**: Save your memes as PNG files
- 📱 **Responsive Design**: Works on desktop and tablet devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **HTML5 Canvas** - Image and text rendering

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cursor-memes.git
cd cursor-memes
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Select an Image**: 
   - Click "Upload Image" to select a file from your computer, or
   - Enter an image URL and click "Load from URL"

2. **Add Text**:
   - Text boxes appear automatically when you load an image
   - Click "+ Add Text Box" to add more text boxes
   - Type your text in the input field

3. **Customize Text**:
   - Adjust font size using the slider
   - Change text color using the color picker or hex input
   - Change border color using the color picker or hex input
   - Adjust X and Y positions to place text precisely

4. **Download**:
   - Click "Download Meme" to save your creation as a PNG file

## Project Structure

```
cursor-memes/
├── src/
│   ├── components/
│   │   ├── ImageSelector.tsx    # Image upload/URL input
│   │   ├── MemeCanvas.tsx        # Canvas rendering
│   │   ├── TextBox.tsx           # Text editing controls
│   │   └── DownloadButton.tsx    # Download functionality
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx                   # Main application component
│   ├── App.css                   # Application styles
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML entry point
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── vite.config.ts                # Vite config
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

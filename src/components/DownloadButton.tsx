interface DownloadButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  disabled?: boolean;
}

export default function DownloadButton({ canvasRef, disabled }: DownloadButtonProps) {
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to create blob from canvas');
        return;
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meme-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className="download-btn"
      type="button"
    >
      Download Meme
    </button>
  );
}

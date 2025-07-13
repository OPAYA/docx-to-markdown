import { useCallback, useState } from 'react';
import { ConversionResult, ConversionOptions } from '../types';
import { convertDocxToMarkdown } from '../utils/converter';
import DemoFeature from './DemoFeature';
import './DropZone.css';

interface DropZoneProps {
  onConversionStart: () => void;
  onConversionComplete: (result: ConversionResult) => void;
  options: ConversionOptions;
  onOptionsChange: (options: ConversionOptions) => void;
  isConverting: boolean;
  conversionResult: ConversionResult | null;
}

export default function DropZone({ 
  onConversionStart, 
  onConversionComplete, 
  options, 
  onOptionsChange,
  isConverting,
  conversionResult
}: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleDemo = () => {
    // Create a demo markdown result
    const demoResult: ConversionResult = {
      markdown: `# Sample Document Title

This is a **sample Markdown** document converted from DOCX format.

## Key Features

- ✅ **Text formatting** support (bold, *italic*, \`code\`)
- ✅ Heading and subheading conversion
- ✅ Lists and numbering
- ✅ Automatic image extraction
- ✅ Table conversion

## Table Example

| Feature | Supported | Description |
|---------|-----------|-------------|
| Text | ✅ | Basic text conversion |
| Images | ✅ | Auto extraction and linking |
| Tables | ✅ | Markdown table format |

## Blockquotes

> This is a blockquote example. DOCX quote styles are converted to Markdown format.

## Code Blocks

\`\`\`javascript
function convertToMarkdown() {
  console.log("DOCX → Markdown conversion complete!");
}
\`\`\`

Conversion completed successfully! 🎉`,
      images: [
        {
          filename: 'sample-image.png',
          data: new Blob(),
          url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
        }
      ],
      warnings: [
        'Some advanced formatting has been simplified',
        'Sample image included for demonstration'
      ]
    };

    onConversionStart();
    setTimeout(() => {
      onConversionComplete(demoResult);
    }, 1500);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const docxFile = files.find(file => 
      file.name.toLowerCase().endsWith('.docx') || 
      file.name.toLowerCase().endsWith('.dotx')
    );
    
    if (docxFile) {
      await processFile(docxFile);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  }, []);

  const processFile = async (file: File) => {
    onConversionStart();
    try {
      const result = await convertDocxToMarkdown(file, options);
      onConversionComplete(result);
    } catch (error) {
      console.error('Conversion failed:', error);
      onConversionComplete({
        markdown: '',
        images: [],
        warnings: [`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
      });
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="drop-zone-container">
      <div 
        className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${isConverting ? 'converting' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isConverting ? (
          <div className="converting-state">
            <div className="spinner"></div>
            <h3>Converting...</h3>
            <p>Processing your DOCX file</p>
          </div>
        ) : (
          <div className="drop-content">
            <div className="step-indicator">
              <span className="step-number">1</span>
            </div>
            <div className="file-icon">📄</div>
            <h3>Drop your Word document here</h3>
            <p className="main-instruction">or click the button below to select a file</p>
            <input
              type="file"
              accept=".docx,.dotx"
              onChange={handleFileSelect}
              className="file-input"
            />
            <button 
              className="select-button primary-cta"
              onClick={() => document.querySelector<HTMLInputElement>('.file-input')?.click()}
            >
              📁 Select DOCX File
            </button>
            <div className="help-text">
              <div className="supported-formats">
                <span className="format-label">Supported formats:</span>
                <span className="format-item">.docx</span>
                <span className="format-item">.dotx</span>
              </div>
              <div className="privacy-note">
                🔒 Files are processed locally in your browser - never uploaded to servers
              </div>
            </div>
          </div>
        )}
      </div>

      {!isConverting && !conversionResult && (
        <DemoFeature onDemoClick={handleDemo} />
      )}

      <div className="advanced-options">
        <button 
          className="toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          ⚙️ Advanced Options {showAdvanced ? '▼' : '▶'}
        </button>
        
        {showAdvanced && (
          <div className="options-panel">
            <div className="options-header">
              <h4>📝 Customize Your Conversion</h4>
              <p>Fine-tune how your DOCX file is converted to Markdown</p>
            </div>

            <div className="option-group">
              <label htmlFor="image-prefix">📁 Image Path Prefix:</label>
              <input
                id="image-prefix"
                type="text"
                value={options.imagePrefix}
                onChange={(e) => onOptionsChange({ ...options, imagePrefix: e.target.value })}
                placeholder="img/"
              />
              <div className="option-help">
                <span className="help-icon">💡</span>
                <span>Path prefix for extracted images (e.g., "img/" or "assets/images/")</span>
              </div>
              <div className="option-example">
                Result: <code>![image](img/image1.png)</code>
              </div>
            </div>
            
            <div className="option-group">
              <label htmlFor="heading-shift">📊 Heading Depth Shift:</label>
              <select
                id="heading-shift"
                value={options.headingDepthShift}
                onChange={(e) => onOptionsChange({ ...options, headingDepthShift: parseInt(e.target.value) })}
              >
                <option value={0}>None (H1 → H1)</option>
                <option value={1}>+1 (H1 → H2)</option>
                <option value={2}>+2 (H1 → H3)</option>
              </select>
              <div className="option-help">
                <span className="help-icon">💡</span>
                <span>Shift all headings down by N levels (useful for document sections)</span>
              </div>
              <div className="option-example">
                Example: H1 "Title" becomes H2 "## Title" with +1 shift
              </div>
            </div>
            
            <div className="option-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.inlineImages}
                  onChange={(e) => onOptionsChange({ ...options, inlineImages: e.target.checked })}
                />
                <span className="checkbox-text">
                  <span className="checkbox-title">🖼️ Inline images as Base64</span>
                  <span className="checkbox-description">Embed images directly in Markdown (larger file, no external dependencies)</span>
                </span>
              </label>
            </div>
            
            <div className="options-footer">
              <button 
                className="reset-options"
                onClick={() => onOptionsChange({
                  imagePrefix: 'img/',
                  headingDepthShift: 0,
                  inlineImages: false,
                })}
              >
                🔄 Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
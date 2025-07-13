import { useState } from 'react';
import { ConversionResult } from '../types';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { marked } from 'marked';
import './PreviewPanel.css';

interface PreviewPanelProps {
  result: ConversionResult | null;
  isConverting: boolean;
  onReset: () => void;
}

type TabType = 'markdown' | 'rendered' | 'logs';

export default function PreviewPanel({ result, isConverting, onReset }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('markdown');

  // Configure marked for better rendering
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert \n to <br>
    tables: true, // Enable table support
    sanitize: false, // Allow HTML (for better rendering)
  });

  const handleCopyMarkdown = async () => {
    if (result?.markdown) {
      await navigator.clipboard.writeText(result.markdown);
    }
  };

  const handleDownloadMarkdown = () => {
    if (result?.markdown) {
      const blob = new Blob([result.markdown], { type: 'text/markdown' });
      saveAs(blob, 'converted.md');
    }
  };

  const handleDownloadZip = async () => {
    if (!result) return;

    const zip = new JSZip();
    
    // Add markdown file
    zip.file('README.md', result.markdown);
    
    // Add images
    if (result.images.length > 0) {
      const imgFolder = zip.folder('img');
      for (const image of result.images) {
        imgFolder?.file(image.filename, image.data);
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'converted.zip');
  };

  const renderMarkdownAsHtml = (markdown: string) => {
    try {
      // Use marked for proper Markdown rendering with tables and code blocks
      return marked(markdown);
    } catch (error) {
      console.error('Markdown rendering error:', error);
      // Fallback to simple conversion if marked fails
      return markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/!\[([^\]]*)\]\(([^\)]+)\)/gim, '<img alt="$1" src="$2" style="max-width: 100%;" />')
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
        .replace(/\n/gim, '<br />');
    }
  };

  if (isConverting) {
    return (
      <div className="preview-panel">
        <div className="preview-header">
          <h3>Converting...</h3>
        </div>
        <div className="preview-content loading">
          <div className="spinner"></div>
          <p>Processing your document...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="preview-panel">
        <div className="preview-header">
          <div className="step-indicator">
            <span className="step-number">2</span>
          </div>
          <h3>Conversion Preview</h3>
        </div>
        <div className="preview-content empty">
          <div className="empty-icon">👁️</div>
          <h4>No document converted yet</h4>
          <p>Select a DOCX file on the left to see<br/>the Markdown preview here</p>
          <div className="preview-steps">
            <div className="preview-step">
              <span className="step-badge">📄</span>
              <span>Markdown Code</span>
            </div>
            <div className="preview-step">
              <span className="step-badge">🖼️</span>
              <span>Rendered Preview</span>
            </div>
            <div className="preview-step">
              <span className="step-badge">📋</span>
              <span>Conversion Log</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'markdown' ? 'active' : ''}`}
            onClick={() => setActiveTab('markdown')}
          >
            📄 Markdown Code
          </button>
          <button
            className={`tab ${activeTab === 'rendered' ? 'active' : ''}`}
            onClick={() => setActiveTab('rendered')}
          >
            🖼️ Preview
          </button>
          <button
            className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📋 Logs ({result.warnings.length})
          </button>
        </div>
        
        <div className="actions">
          <div className="step-indicator download-step">
            <span className="step-number">3</span>
          </div>
          <button className="action-btn" onClick={handleCopyMarkdown} title="Copy Markdown code">
            📋 Copy
          </button>
          <button className="action-btn download-primary" onClick={handleDownloadMarkdown} title="Download Markdown file">
            📄 Download MD
          </button>
          <button className="action-btn" onClick={handleDownloadZip} title="Download ZIP with images">
            📦 Download ZIP
          </button>
          <button className="action-btn reset" onClick={onReset} title="Reset and start over">
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="preview-content">
        {activeTab === 'markdown' && (
          <pre className="markdown-preview">
            <code>{result.markdown}</code>
          </pre>
        )}
        
        {activeTab === 'rendered' && (
          <div 
            className="rendered-preview"
            dangerouslySetInnerHTML={{ __html: renderMarkdownAsHtml(result.markdown) }}
          />
        )}
        
        {activeTab === 'logs' && (
          <div className="logs-preview">
            {result.warnings.length === 0 ? (
              <p className="no-warnings">✅ No warnings</p>
            ) : (
              <ul className="warnings-list">
                {result.warnings.map((warning, index) => (
                  <li key={index} className="warning-item">
                    ⚠️ {warning}
                  </li>
                ))}
              </ul>
            )}
            
            {result.images.length > 0 && (
              <div className="images-info">
                <h4>📸 Extracted Images ({result.images.length})</h4>
                <ul className="images-list">
                  {result.images.map((image, index) => (
                    <li key={index} className="image-item">
                      {image.filename}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
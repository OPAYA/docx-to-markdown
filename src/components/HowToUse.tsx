import { useState } from 'react';
import './HowToUse.css';

export default function HowToUse() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="how-to-use">
      <button 
        className="help-button"
        onClick={() => setShowGuide(!showGuide)}
        title="View usage guide"
      >
        ❓ First time using this?
      </button>
      
      {showGuide && (
        <div className="guide-overlay" onClick={() => setShowGuide(false)}>
          <div className="guide-modal" onClick={(e) => e.stopPropagation()}>
            <div className="guide-header">
              <h3>🚀 DOCX → Markdown Converter Guide</h3>
              <button 
                className="close-button"
                onClick={() => setShowGuide(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="guide-content">
              <div className="guide-steps">
                <div className="guide-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>📁 Select File</h4>
                    <p>Drag a Word document (.docx) to the left area or click the "Select File" button</p>
                  </div>
                </div>
                
                <div className="guide-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>👀 Preview Results</h4>
                    <p>Check the converted Markdown on the right side and switch tabs as needed</p>
                    <ul>
                      <li><strong>Markdown Code:</strong> Copyable source code</li>
                      <li><strong>Preview:</strong> Rendered final result</li>
                      <li><strong>Logs:</strong> Conversion information and warnings</li>
                    </ul>
                  </div>
                </div>
                
                <div className="guide-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>💾 Download</h4>
                    <p>Save the file in your preferred format</p>
                    <ul>
                      <li><strong>Copy:</strong> Copy to clipboard</li>
                      <li><strong>Download MD:</strong> Markdown file only</li>
                      <li><strong>Download ZIP:</strong> Complete package with images</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="guide-tips">
                <h4>💡 Helpful Tips</h4>
                <ul>
                  <li>Documents with images are automatically extracted</li>
                  <li>Advanced options allow you to adjust image paths and heading levels</li>
                  <li>All conversions are processed locally in your browser for complete security</li>
                  <li>Works offline without internet connection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
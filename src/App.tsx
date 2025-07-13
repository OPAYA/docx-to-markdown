import { useState } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import PreviewPanel from './components/PreviewPanel';
import HowToUse from './components/HowToUse';
import { ConversionResult, ConversionOptions } from './types';
import './App.css';

function App() {
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [options, setOptions] = useState<ConversionOptions>({
    imagePrefix: 'img/',
    headingDepthShift: 0,
    inlineImages: false,
  });

  const handleFileConversion = (result: ConversionResult) => {
    setConversionResult(result);
    setIsConverting(false);
  };

  const handleConversionStart = () => {
    setIsConverting(true);
    setConversionResult(null);
  };

  const handleReset = () => {
    setConversionResult(null);
    setIsConverting(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      
      <main className="main-content">
        <div className="content-grid">
          <DropZone
            onConversionStart={handleConversionStart}
            onConversionComplete={handleFileConversion}
            options={options}
            onOptionsChange={setOptions}
            isConverting={isConverting}
            conversionResult={conversionResult}
          />
          
          <PreviewPanel
            result={conversionResult}
            isConverting={isConverting}
            onReset={handleReset}
          />
        </div>
      </main>
      
      <HowToUse />
    </div>
  );
}

export default App;
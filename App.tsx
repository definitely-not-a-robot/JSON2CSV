import React, { useState, useCallback, useEffect } from 'react';
import { convertJsonToCsv } from './services/csvConverter';
import { EditorPanel } from './components/EditorPanel';
import { ActionButton } from './components/ActionButton';
import { Header } from './components/Header';
import { ArrowRightIcon, DownloadIcon, ClipboardIcon, TrashIcon } from './components/Icons';
import { DepthSelector } from './components/DepthSelector';
import { AutoConvertToggle } from './components/AutoConvertToggle';

const App: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [csvOutput, setCsvOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [depth, setDepth] = useState<number>(2);
  const [autoConvert, setAutoConvert] = useState<boolean>(true);

  const handleConvert = useCallback(() => {
    if (!jsonInput.trim()) {
      // Don't show an error for empty input when auto-converting, just clear the output
      if (autoConvert) {
        setCsvOutput('');
        setError(null);
      } else {
        setError('JSON input cannot be empty.');
        setCsvOutput('');
      }
      return;
    }
    try {
      const result = convertJsonToCsv(jsonInput, depth);
      setCsvOutput(result);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during conversion.');
      }
      setCsvOutput('');
    }
  }, [jsonInput, depth, autoConvert]);

  // Effect for auto-conversion with debouncing
  useEffect(() => {
    if (!autoConvert) {
      return;
    }

    const handler = setTimeout(() => {
      handleConvert();
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [jsonInput, depth, autoConvert, handleConvert]);


  const handleDownload = useCallback(() => {
    if (!csvOutput) return;
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [csvOutput]);

  const handleCopyToClipboard = useCallback(() => {
    if (!csvOutput) return;
    navigator.clipboard.writeText(csvOutput).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  }, [csvOutput]);

  const handleClear = useCallback(() => {
    setJsonInput('');
    setCsvOutput('');
    setError(null);
    setCopySuccess('');
  }, []);
  
  const handleSampleData = useCallback(() => {
    const sample = [
      {
        "productId": "SKU-HDPHN-01",
        "productName": "Wireless Noise-Cancelling Headphones",
        "price": 249.99,
        "inStock": true,
        "tags": ["audio", "electronics", "wireless"],
        "specs": {
          "batteryLife": "30 hours",
          "bluetoothVersion": "5.2",
          "weight": "250g"
        },
        "supplier": {
          "name": "AudioPhonics Inc.",
          "contact": {
            "email": "sales@audiophonics.com",
            "phone": "1-800-555-0199"
          }
        }
      },
      {
        "productId": "SKU-SMRTCFM-02",
        "productName": "Smart Coffee Maker",
        "price": 89.50,
        "inStock": false,
        "tags": ["kitchen", "smart home", "appliances"],
        "specs": {
          "capacity": "12 cups",
          "wifiEnabled": true,
          "weight": "1.2kg"
        },
        "supplier": {
          "name": "KitchenWiz",
          "contact": {
            "email": "support@kitchenwiz.co",
            "phone": "1-888-555-0123"
          }
        }
      },
      {
        "productId": "SKU-MECHKEY-03",
        "productName": "RGB Mechanical Keyboard",
        "price": 120.00,
        "inStock": true,
        "tags": ["gaming", "computer", "peripheral"],
        "specs": {
          "switchType": "Blue",
          "backlight": "RGB",
          "weight": "980g"
        },
        "supplier": {
          "name": "GamerGear Corp",
          "contact": {
            "email": "orders@gamergear.com",
            "phone": "1-877-555-0155"
          }
        }
      }
    ];
    try {
      setJsonInput(JSON.stringify(sample, null, 2));
      setError(null);
    } catch (err) {
      const errorMessage = "Failed to load sample data.";
      setError(errorMessage);
      console.error(errorMessage, err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col p-4 md:p-6">
      <Header />
      <main className="flex-grow flex flex-col lg:flex-row gap-4 lg:gap-6 mt-6">
        <EditorPanel
          title="JSON Input"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Paste your JSON here or load sample data...'
          error={error}
          actions={
            <ActionButton onClick={handleSampleData} tooltip="Load Sample JSON">
              Load Sample
            </ActionButton>
          }
        />

        <div className="flex flex-col items-center justify-center gap-4 py-4 lg:py-0">
           <ActionButton
              onClick={handleConvert}
              disabled={autoConvert}
              className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto"
              tooltip={autoConvert ? 'Auto-convert is ON' : 'Convert JSON to CSV'}
            >
              <ArrowRightIcon />
              <span className="hidden lg:inline ml-2">Convert</span>
            </ActionButton>

            <AutoConvertToggle 
              autoConvert={autoConvert} 
              onToggle={() => setAutoConvert(!autoConvert)} 
            />
            
            <DepthSelector depth={depth} onDepthChange={setDepth} />

            <ActionButton
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-700 w-full lg:w-auto"
              tooltip="Clear all fields"
            >
              <TrashIcon />
               <span className="hidden lg:inline ml-2">Clear</span>
            </ActionButton>
        </div>

        <EditorPanel
          title="CSV Output"
          value={csvOutput}
          readOnly
          placeholder='CSV output will appear here...'
          actions={
            <div className="flex items-center gap-2">
              <ActionButton onClick={handleCopyToClipboard} disabled={!csvOutput} tooltip="Copy to Clipboard">
                <ClipboardIcon />
                {copySuccess && <span className="text-xs ml-1">{copySuccess}</span>}
              </ActionButton>
              <ActionButton onClick={handleDownload} disabled={!csvOutput} tooltip="Download .csv file">
                <DownloadIcon />
              </ActionButton>
            </div>
          }
        />
      </main>
    </div>
  );
};

export default App;
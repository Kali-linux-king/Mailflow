import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Minimize2, Palette, Download } from "lucide-react";
import { toast } from 'react-toastify';

export function CSSMinifier() {
  const [inputCSS, setInputCSS] = useState('');
  const [minifiedCSS, setMinifiedCSS] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [minifiedSize, setMinifiedSize] = useState(0);

  const minifyCSS = () => {
    if (!inputCSS.trim()) {
      toast.error('Please enter CSS content');
      return;
    }

    // CSS minification
    let minified = inputCSS
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove unnecessary whitespace
      .replace(/\s+/g, ' ')
      // Remove spaces around special characters
      .replace(/\s*([{}:;,>+~])\s*/g, '$1')
      // Remove trailing semicolons before }
      .replace(/;}/g, '}')
      // Remove leading/trailing whitespace
      .trim();

    const originalBytes = new TextEncoder().encode(inputCSS).length;
    const minifiedBytes = new TextEncoder().encode(minified).length;
    
    setOriginalSize(originalBytes);
    setMinifiedSize(minifiedBytes);
    setMinifiedCSS(minified);
    
    const reduction = ((originalBytes - minifiedBytes) / originalBytes * 100).toFixed(1);
    toast.success(`CSS minified! Reduced by ${reduction}%`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(minifiedCSS);
    toast.success('Minified CSS copied to clipboard!');
  };

  const downloadCSS = () => {
    const blob = new Blob([minifiedCSS], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'minified.css';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSS file downloaded!');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CSS Minifier & Optimizer</h1>
        <p className="text-gray-600">Minify CSS by removing whitespace, comments, and unnecessary characters to improve load times.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Input CSS
          </CardTitle>
          <CardDescription>
            Paste your CSS code below to minify and optimize
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder=".container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
}"
            value={inputCSS}
            onChange={(e) => setInputCSS(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Size: {formatBytes(new TextEncoder().encode(inputCSS).length)}
            </div>
            <Button onClick={minifyCSS} disabled={!inputCSS.trim()}>
              <Minimize2 className="w-4 h-4 mr-2" />
              Minify CSS
            </Button>
          </div>
        </CardContent>
      </Card>

      {minifiedCSS && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Minified CSS</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  Original: {formatBytes(originalSize)}
                </span>
                <span className="text-green-600 font-bold">
                  Minified: {formatBytes(minifiedSize)}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  -{((originalSize - minifiedSize) / originalSize * 100).toFixed(1)}%
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={minifiedCSS}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Minified CSS
              </Button>
              <Button variant="outline" onClick={downloadCSS}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Minimize2, FileCode, Download } from "lucide-react";
import { toast } from 'react-toastify';

export function HTMLMinifier() {
  const [inputHTML, setInputHTML] = useState('');
  const [minifiedHTML, setMinifiedHTML] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [minifiedSize, setMinifiedSize] = useState(0);

  const minifyHTML = () => {
    if (!inputHTML.trim()) {
      toast.error('Please enter HTML content');
      return;
    }

    // HTML minification
    let minified = inputHTML
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove whitespace between tags
      .replace(/>\s+</g, '><')
      // Remove leading/trailing whitespace
      .replace(/^\s+|\s+$/gm, '')
      // Remove extra spaces
      .replace(/\s+/g, ' ')
      // Remove quotes from single-word attributes
      .replace(/=["']([a-zA-Z0-9-_]+)["']/g, '=$1')
      .trim();

    const originalBytes = new TextEncoder().encode(inputHTML).length;
    const minifiedBytes = new TextEncoder().encode(minified).length;
    
    setOriginalSize(originalBytes);
    setMinifiedSize(minifiedBytes);
    setMinifiedHTML(minified);
    
    const reduction = ((originalBytes - minifiedBytes) / originalBytes * 100).toFixed(1);
    toast.success(`HTML minified! Reduced by ${reduction}%`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(minifiedHTML);
    toast.success('Minified HTML copied to clipboard!');
  };

  const downloadHTML = () => {
    const blob = new Blob([minifiedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'minified.html';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('HTML file downloaded!');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HTML Minifier & Optimizer</h1>
        <p className="text-gray-600">Minify HTML by removing comments, whitespace, and unnecessary characters to reduce file size.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Input HTML
          </CardTitle>
          <CardDescription>
            Paste your HTML code below to minify and optimize
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="<!DOCTYPE html>
<html>
  <head>
    <title>Example</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>"
            value={inputHTML}
            onChange={(e) => setInputHTML(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Size: {formatBytes(new TextEncoder().encode(inputHTML).length)}
            </div>
            <Button onClick={minifyHTML} disabled={!inputHTML.trim()}>
              <Minimize2 className="w-4 h-4 mr-2" />
              Minify HTML
            </Button>
          </div>
        </CardContent>
      </Card>

      {minifiedHTML && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Minified HTML</span>
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
              value={minifiedHTML}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button onClick={copyToClipboard} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Minified HTML
              </Button>
              <Button variant="outline" onClick={downloadHTML}>
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
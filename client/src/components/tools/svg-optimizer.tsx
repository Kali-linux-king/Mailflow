import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Minimize2, FileCode, AlertCircle } from "lucide-react";
import { toast } from 'react-toastify';

export function SVGOptimizer() {
  const [inputSVG, setInputSVG] = useState('');
  const [optimizedSVG, setOptimizedSVG] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [optimizedSize, setOptimizedSize] = useState(0);
  const [processing, setProcessing] = useState(false);

  const optimizeSVG = () => {
    if (!inputSVG.trim()) {
      toast.error('Please enter SVG content');
      return;
    }

    setProcessing(true);
    
    try {
      // Basic SVG optimization
      let optimized = inputSVG
        // Remove comments
        .replace(/<!--[\s\S]*?-->/g, '')
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        // Remove empty attributes
        .replace(/\s+[a-zA-Z-]+=""/g, '')
        // Remove default values
        .replace(/\s+fill="black"/g, '')
        .replace(/\s+fill="#000000"/g, '')
        .replace(/\s+fill="#000"/g, '')
        .replace(/\s+stroke="none"/g, '')
        .replace(/\s+stroke-width="1"/g, '')
        // Remove XML declaration if not needed
        .replace(/<\?xml[^>]*\?>/g, '')
        // Remove DOCTYPE if present
        .replace(/<!DOCTYPE[^>]*>/g, '')
        // Trim
        .trim();

      // Calculate file sizes
      const originalBytes = new TextEncoder().encode(inputSVG).length;
      const optimizedBytes = new TextEncoder().encode(optimized).length;
      
      setOriginalSize(originalBytes);
      setOptimizedSize(optimizedBytes);
      setOptimizedSVG(optimized);
      
      const reduction = ((originalBytes - optimizedBytes) / originalBytes * 100).toFixed(1);
      toast.success(`SVG optimized! Reduced by ${reduction}%`);
    } catch (error) {
      toast.error('Error optimizing SVG');
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadSVG = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('SVG downloaded!');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SVG Optimizer & Minifier</h1>
        <p className="text-gray-600">Optimize and minify SVG files by removing unnecessary code, reducing file size while preserving quality.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Input SVG Code
          </CardTitle>
          <CardDescription>
            Paste your SVG code below to optimize and reduce file size
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="red" />
</svg>`}
            value={inputSVG}
            onChange={(e) => setInputSVG(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Size: {formatBytes(new TextEncoder().encode(inputSVG).length)}
            </div>
            <Button onClick={optimizeSVG} disabled={processing || !inputSVG.trim()}>
              {processing ? (
                <>
                  <Minimize2 className="w-4 h-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Optimize SVG
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {optimizedSVG && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Optimized SVG</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  Original: {formatBytes(originalSize)}
                </span>
                <span className="text-green-600 font-bold">
                  Optimized: {formatBytes(optimizedSize)}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  -{((originalSize - optimizedSize) / originalSize * 100).toFixed(1)}%
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="code" className="w-full">
              <TabsList>
                <TabsTrigger value="code">Optimized Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code">
                <div className="relative">
                  <Textarea
                    value={optimizedSVG}
                    readOnly
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(optimizedSVG)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadSVG(optimizedSVG, 'optimized.svg')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Original</h3>
                    <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
                      <div dangerouslySetInnerHTML={{ __html: inputSVG }} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Optimized</h3>
                    <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
                      <div dangerouslySetInnerHTML={{ __html: optimizedSVG }} />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="comparison">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{formatBytes(originalSize)}</div>
                      <div className="text-sm text-gray-600">Original Size</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{formatBytes(optimizedSize)}</div>
                      <div className="text-sm text-gray-600">Optimized Size</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatBytes(originalSize - optimizedSize)}
                      </div>
                      <div className="text-sm text-gray-600">Size Reduction</div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Optimization Benefits</span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Faster loading times for web pages</li>
                      <li>• Reduced bandwidth usage</li>
                      <li>• Better performance on mobile devices</li>
                      <li>• Maintained visual quality and scalability</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Star, Palette } from "lucide-react";
import { toast } from 'react-toastify';

export function FaviconGenerator() {
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState('#007bff');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState('64');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [generatedFavicons, setGeneratedFavicons] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const faviconSizes = [16, 32, 48, 64, 96, 128, 180, 192, 512];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateFavicons = () => {
    if (!text.trim() && !uploadedImage) {
      toast.error('Please enter text or upload an image');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const favicons: string[] = [];

    faviconSizes.forEach(size => {
      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      if (uploadedImage) {
        // Draw uploaded image
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          favicons.push(canvas.toDataURL('image/png'));
          if (favicons.length === faviconSizes.length) {
            setGeneratedFavicons(favicons);
            toast.success('Favicons generated successfully!');
          }
        };
        img.src = uploadedImage;
      } else {
        // Draw text favicon
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = textColor;
        ctx.font = `bold ${Math.floor(size * 0.6)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.substring(0, 2).toUpperCase(), size / 2, size / 2);

        favicons.push(canvas.toDataURL('image/png'));
      }
    });

    if (!uploadedImage) {
      setGeneratedFavicons(favicons);
      toast.success('Favicons generated successfully!');
    }
  };

  const downloadFavicon = (dataUrl: string, size: number) => {
    const link = document.createElement('a');
    link.download = `favicon-${size}x${size}.png`;
    link.href = dataUrl;
    link.click();
    toast.success(`Favicon ${size}x${size} downloaded!`);
  };

  const downloadAll = () => {
    generatedFavicons.forEach((dataUrl, index) => {
      setTimeout(() => {
        downloadFavicon(dataUrl, faviconSizes[index]);
      }, index * 100);
    });
  };

  const generateHTMLCode = () => {
    const htmlCode = faviconSizes.map(size => {
      if (size === 16) return `<link rel="icon" type="image/png" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">`;
      if (size === 32) return `<link rel="icon" type="image/png" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">`;
      if (size === 180) return `<link rel="apple-touch-icon" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">`;
      if (size === 192) return `<link rel="icon" type="image/png" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">`;
      if (size === 512) return `<link rel="icon" type="image/png" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">`;
      return `<link rel="icon" type="image/png" sizes="${size}x${size}" href="/favicon-${size}x${size}.png">`;
    }).join('\n');

    navigator.clipboard.writeText(htmlCode);
    toast.success('HTML code copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Favicon Generator</h1>
        <p className="text-gray-600">Generate favicons in multiple sizes from text or images for all devices and browsers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Favicon Configuration
          </CardTitle>
          <CardDescription>
            Choose between text-based or image-based favicon generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Text-based Favicon</h3>
              <Input
                placeholder="Enter 1-2 characters"
                value={text}
                onChange={(e) => setText(e.target.value.substring(0, 2))}
                maxLength={2}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded border"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      placeholder="#007bff"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 rounded border"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Image-based Favicon</h3>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Upload preview" className="max-w-full max-h-24 mx-auto" />
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-gray-600">Click to upload image</p>
                    <p className="text-sm text-gray-400">PNG, JPG, SVG supported</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <Button onClick={generateFavicons} className="w-full">
            <Palette className="w-4 h-4 mr-2" />
            Generate Favicons
          </Button>
        </CardContent>
      </Card>

      {generatedFavicons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Favicons ({generatedFavicons.length} sizes)
              <div className="flex gap-2">
                <Button variant="outline" onClick={generateHTMLCode}>
                  Copy HTML
                </Button>
                <Button variant="outline" onClick={downloadAll}>
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {generatedFavicons.map((dataUrl, index) => {
                const size = faviconSizes[index];
                return (
                  <div key={size} className="text-center">
                    <div className="border rounded p-2 bg-gray-50 mb-2">
                      <img 
                        src={dataUrl} 
                        alt={`${size}x${size}`}
                        className="mx-auto"
                        style={{ width: Math.min(size, 48), height: Math.min(size, 48) }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{size}×{size}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFavicon(dataUrl, size)}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold mb-2">Usage Instructions:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Download all favicon files to your website's root directory</li>
                <li>2. Copy the HTML code and paste it in your &lt;head&gt; section</li>
                <li>3. Ensure the file paths match your directory structure</li>
                <li>4. Test your favicons on different devices and browsers</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
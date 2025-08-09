import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Download, Crop, RotateCcw, ImageIcon } from "lucide-react";
import { toast } from 'react-toastify';

export function ImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [newWidth, setNewWidth] = useState<number>(0);
  const [newHeight, setNewHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(90);
  const [processedImage, setProcessedImage] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    setSelectedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        setNewWidth(img.width);
        setNewHeight(img.height);
        setPreview(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (value: number) => {
    setNewWidth(value);
    if (maintainAspectRatio && width > 0) {
      setNewHeight(Math.round((value * height) / width));
    }
  };

  const handleHeightChange = (value: number) => {
    setNewHeight(value);
    if (maintainAspectRatio && height > 0) {
      setNewWidth(Math.round((value * width) / height));
    }
  };

  const resetDimensions = () => {
    setNewWidth(width);
    setNewHeight(height);
  };

  const resizeImage = () => {
    if (!selectedFile || !canvasRef.current) return;

    setProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Clear canvas
      ctx?.clearRect(0, 0, newWidth, newHeight);
      
      // Draw resized image
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert to desired format
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const qualityValue = format === 'png' ? 1 : quality / 100;
      
      const resizedDataUrl = canvas.toDataURL(mimeType, qualityValue);
      setProcessedImage(resizedDataUrl);
      setProcessing(false);
      
      toast.success('Image resized successfully!');
    };

    img.src = preview;
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = `resized-image.${format}`;
    link.href = processedImage;
    link.click();
    
    toast.success('Image downloaded successfully!');
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Resizer & Cropper</h1>
        <p className="text-gray-600">Resize, crop, and scale images to exact dimensions with smart cropping and aspect ratio maintenance.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Image
          </CardTitle>
          <CardDescription>
            Select an image file to resize and optimize
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="Preview" className="max-w-full max-h-48 mx-auto rounded" />
                  <p className="text-sm text-gray-600">
                    Original: {width} × {height} pixels
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-gray-600">Click to upload an image</p>
                  <p className="text-sm text-gray-400">Supports JPG, PNG, WebP, GIF</p>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crop className="w-5 h-5" />
              Resize Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Width (px)</label>
                <Input
                  type="number"
                  value={newWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Height (px)</label>
                <Input
                  type="number"
                  value={newHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  min="1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="aspect-ratio"
                checked={maintainAspectRatio}
                onCheckedChange={(checked) => setMaintainAspectRatio(checked as boolean)}
              />
              <label htmlFor="aspect-ratio" className="text-sm font-medium">
                Maintain aspect ratio
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Output Format</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {format === 'jpeg' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Quality ({quality}%)</label>
                  <Input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={resizeImage} disabled={processing} className="flex-1">
                {processing ? 'Processing...' : 'Resize Image'}
              </Button>
              <Button variant="outline" onClick={resetDimensions}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {processedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Resized Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <img src={processedImage} alt="Resized" className="max-w-full max-h-64 mx-auto rounded border" />
              <p className="text-sm text-gray-600 mt-2">
                New size: {newWidth} × {newHeight} pixels
              </p>
            </div>
            
            <Button onClick={downloadImage} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Resized Image
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
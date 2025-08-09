import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Crop, RotateCcw, Move } from "lucide-react";
import { toast } from 'react-toastify';

export function ImageCropper() {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(200);
  const [cropHeight, setCropHeight] = useState(200);
  const [aspectRatio, setAspectRatio] = useState('free');
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const aspectRatios = {
    'free': { label: 'Free Form', ratio: null },
    '1:1': { label: 'Square (1:1)', ratio: 1 },
    '4:3': { label: 'Landscape (4:3)', ratio: 4/3 },
    '3:4': { label: 'Portrait (3:4)', ratio: 3/4 },
    '16:9': { label: 'Wide (16:9)', ratio: 16/9 },
    '9:16': { label: 'Tall (9:16)', ratio: 9/16 }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setCropX(0);
        setCropY(0);
        setCropWidth(Math.min(200, img.width));
        setCropHeight(Math.min(200, img.height));
        setCroppedImage('');
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const updateAspectRatio = (ratio: string) => {
    setAspectRatio(ratio);
    const selectedRatio = aspectRatios[ratio as keyof typeof aspectRatios].ratio;
    
    if (selectedRatio && originalImage) {
      const newHeight = cropWidth / selectedRatio;
      if (newHeight <= originalImage.height - cropY) {
        setCropHeight(newHeight);
      } else {
        const newWidth = cropHeight * selectedRatio;
        setCropWidth(newWidth);
      }
    }
  };

  const cropImage = () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    ctx.drawImage(
      originalImage,
      cropX, cropY, cropWidth, cropHeight,
      0, 0, cropWidth, cropHeight
    );

    const croppedDataUrl = canvas.toDataURL('image/png');
    setCroppedImage(croppedDataUrl);
    toast.success('Image cropped successfully!');
  };

  const downloadCroppedImage = () => {
    if (!croppedImage) return;

    const link = document.createElement('a');
    link.download = 'cropped-image.png';
    link.href = croppedImage;
    link.click();
    toast.success('Cropped image downloaded!');
  };

  const resetCrop = () => {
    if (originalImage) {
      setCropX(0);
      setCropY(0);
      setCropWidth(Math.min(200, originalImage.width));
      setCropHeight(Math.min(200, originalImage.height));
      setCroppedImage('');
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !previewRef.current || !originalImage) return;

    const rect = previewRef.current.getBoundingClientRect();
    const scaleX = originalImage.width / rect.width;
    const scaleY = originalImage.height / rect.height;
    
    const newX = Math.max(0, Math.min((e.clientX - rect.left) * scaleX, originalImage.width - cropWidth));
    const newY = Math.max(0, Math.min((e.clientY - rect.top) * scaleY, originalImage.height - cropHeight));
    
    setCropX(newX);
    setCropY(newY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Cropper & Editor</h1>
        <p className="text-gray-600">Crop images to exact dimensions with preset aspect ratios and manual selection tools.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Image
          </CardTitle>
          <CardDescription>
            Select an image file to crop and edit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedImage ? (
              <div 
                ref={previewRef}
                className="relative inline-block"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img 
                  src={selectedImage} 
                  alt="Preview" 
                  className="max-w-full max-h-64 rounded"
                  style={{ maxWidth: '400px' }}
                />
                {originalImage && (
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
                    style={{
                      left: `${(cropX / originalImage.width) * 100}%`,
                      top: `${(cropY / originalImage.height) * 100}%`,
                      width: `${(cropWidth / originalImage.width) * 100}%`,
                      height: `${(cropHeight / originalImage.height) * 100}%`,
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-1 rounded">
                      <Move className="w-3 h-3 inline" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Crop className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-gray-600">Click to upload an image</p>
                <p className="text-sm text-gray-400">Supports JPG, PNG, WebP</p>
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
        </CardContent>
      </Card>

      {selectedImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crop className="w-5 h-5" />
              Crop Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Aspect Ratio</label>
              <Select value={aspectRatio} onValueChange={updateAspectRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(aspectRatios).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">X Position</label>
                <Input
                  type="number"
                  value={Math.round(cropX)}
                  onChange={(e) => setCropX(Number(e.target.value))}
                  min="0"
                  max={originalImage ? originalImage.width - cropWidth : 0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Y Position</label>
                <Input
                  type="number"
                  value={Math.round(cropY)}
                  onChange={(e) => setCropY(Number(e.target.value))}
                  min="0"
                  max={originalImage ? originalImage.height - cropHeight : 0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Width</label>
                <Input
                  type="number"
                  value={Math.round(cropWidth)}
                  onChange={(e) => {
                    const width = Number(e.target.value);
                    setCropWidth(width);
                    const selectedRatio = aspectRatios[aspectRatio as keyof typeof aspectRatios].ratio;
                    if (selectedRatio) {
                      setCropHeight(width / selectedRatio);
                    }
                  }}
                  min="1"
                  max={originalImage?.width || 1000}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Height</label>
                <Input
                  type="number"
                  value={Math.round(cropHeight)}
                  onChange={(e) => {
                    const height = Number(e.target.value);
                    setCropHeight(height);
                    const selectedRatio = aspectRatios[aspectRatio as keyof typeof aspectRatios].ratio;
                    if (selectedRatio) {
                      setCropWidth(height * selectedRatio);
                    }
                  }}
                  min="1"
                  max={originalImage?.height || 1000}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={cropImage} className="flex-1">
                <Crop className="w-4 h-4 mr-2" />
                Crop Image
              </Button>
              <Button variant="outline" onClick={resetCrop}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {croppedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Cropped Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <img src={croppedImage} alt="Cropped" className="max-w-full rounded border" />
              <p className="text-sm text-gray-600 mt-2">
                Size: {Math.round(cropWidth)} × {Math.round(cropHeight)} pixels
              </p>
            </div>
            
            <Button onClick={downloadCroppedImage} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Cropped Image
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
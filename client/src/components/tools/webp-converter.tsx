import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload, Download, RefreshCw, ImageIcon } from "lucide-react";
import { toast } from 'react-toastify';

export function WebPConverter() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedImages, setConvertedImages] = useState<{file: File, dataUrl: string, originalSize: number, newSize: number}[]>([]);
  const [outputFormat, setOutputFormat] = useState('webp');
  const [quality, setQuality] = useState(80);
  const [converting, setConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const supportedFormats = {
    webp: { name: 'WebP', extension: 'webp', mime: 'image/webp' },
    jpeg: { name: 'JPEG', extension: 'jpg', mime: 'image/jpeg' },
    png: { name: 'PNG', extension: 'png', mime: 'image/png' },
    bmp: { name: 'BMP', extension: 'bmp', mime: 'image/bmp' }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast.error('Some files were skipped - only image files are supported');
    }
    
    if (imageFiles.length === 0) {
      toast.error('Please select valid image files');
      return;
    }

    setSelectedFiles(imageFiles);
    setConvertedImages([]);
    toast.success(`${imageFiles.length} image(s) selected`);
  };

  const convertImages = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select images to convert');
      return;
    }

    setConverting(true);
    const results: {file: File, dataUrl: string, originalSize: number, newSize: number}[] = [];

    try {
      for (const file of selectedFiles) {
        const result = await convertSingleImage(file);
        if (result) {
          results.push(result);
        }
      }

      setConvertedImages(results);
      
      const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
      const totalNew = results.reduce((sum, r) => sum + r.newSize, 0);
      const reduction = ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
      
      toast.success(`${results.length} images converted! Total size reduction: ${reduction}%`);
    } catch (error) {
      toast.error('Error converting images');
    } finally {
      setConverting(false);
    }
  };

  const convertSingleImage = (file: File): Promise<{file: File, dataUrl: string, originalSize: number, newSize: number} | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = canvasRef.current;
      
      if (!canvas) {
        resolve(null);
        return;
      }

      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const format = supportedFormats[outputFormat as keyof typeof supportedFormats];
        const qualityValue = outputFormat === 'png' ? 1 : quality / 100;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                file,
                dataUrl: reader.result as string,
                originalSize: file.size,
                newSize: blob.size
              });
            };
            reader.readAsDataURL(blob);
          } else {
            resolve(null);
          }
        }, format.mime, qualityValue);
      };

      img.onerror = () => resolve(null);
      img.src = URL.createObjectURL(file);
    });
  };

  const downloadSingle = (result: {file: File, dataUrl: string, originalSize: number, newSize: number}) => {
    const format = supportedFormats[outputFormat as keyof typeof supportedFormats];
    const fileName = result.file.name.replace(/\.[^/.]+$/, '') + '.' + format.extension;
    
    const link = document.createElement('a');
    link.download = fileName;
    link.href = result.dataUrl;
    link.click();
    
    toast.success(`${fileName} downloaded!`);
  };

  const downloadAll = () => {
    convertedImages.forEach((result, index) => {
      setTimeout(() => {
        downloadSingle(result);
      }, index * 100);
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalReduction = () => {
    if (convertedImages.length === 0) return 0;
    const totalOriginal = convertedImages.reduce((sum, r) => sum + r.originalSize, 0);
    const totalNew = convertedImages.reduce((sum, r) => sum + r.newSize, 0);
    return ((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Format Converter</h1>
        <p className="text-gray-600">Convert images between WebP, JPEG, PNG, and BMP formats with quality control and batch processing.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Select Images
          </CardTitle>
          <CardDescription>
            Choose image files to convert (supports batch processing)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFiles.length > 0 ? (
              <div className="space-y-2">
                <ImageIcon className="w-12 h-12 mx-auto text-blue-500" />
                <p className="font-medium">{selectedFiles.length} image(s) selected</p>
                <div className="text-sm text-gray-600">
                  {selectedFiles.map(file => file.name).slice(0, 3).join(', ')}
                  {selectedFiles.length > 3 && ` +${selectedFiles.length - 3} more`}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-gray-600">Click to select images</p>
                <p className="text-sm text-gray-400">Supports JPG, PNG, WebP, BMP, GIF</p>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </CardContent>
      </Card>

      {selectedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Conversion Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Output Format</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(supportedFormats).map(([key, format]) => (
                      <SelectItem key={key} value={key}>{format.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {outputFormat !== 'png' && (
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Format Benefits:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>WebP:</strong> Best compression, modern browsers</li>
                <li>• <strong>JPEG:</strong> Good compression, universal support</li>
                <li>• <strong>PNG:</strong> Lossless, supports transparency</li>
                <li>• <strong>BMP:</strong> Uncompressed, large file sizes</li>
              </ul>
            </div>

            <Button onClick={convertImages} disabled={converting} className="w-full">
              {converting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Convert Images
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {convertedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Conversion Results ({convertedImages.length} images)
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  -{getTotalReduction()}% total reduction
                </span>
                <Button variant="outline" onClick={downloadAll}>
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {convertedImages.map((result, index) => {
                const reduction = ((result.originalSize - result.newSize) / result.originalSize * 100).toFixed(1);
                const format = supportedFormats[outputFormat as keyof typeof supportedFormats];
                
                return (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded border">
                    <img 
                      src={result.dataUrl} 
                      alt={result.file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{result.file.name}</p>
                      <div className="text-xs text-gray-600 flex gap-4">
                        <span>Original: {formatBytes(result.originalSize)}</span>
                        <span>New: {formatBytes(result.newSize)}</span>
                        <span className="text-green-600">-{reduction}%</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadSingle(result)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
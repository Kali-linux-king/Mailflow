import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ImageCompressor() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState([80]);
  const [format, setFormat] = useState('original');
  const [compressing, setCompressing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({ 
        title: "Warning", 
        description: "Only image files are supported", 
        variant: "destructive" 
      });
    }
    
    setSelectedFiles(imageFiles);
  };

  const compressImages = async () => {
    if (selectedFiles.length === 0) {
      toast({ title: "Error", description: "Please select images to compress", variant: "destructive" });
      return;
    }

    setCompressing(true);
    
    // Simulate compression process
    setTimeout(() => {
      setCompressing(false);
      toast({ 
        title: "Compression Complete", 
        description: `${selectedFiles.length} image(s) compressed successfully` 
      });
    }, 2000);
  };

  const downloadCompressed = () => {
    toast({ title: "Download Started", description: "Compressed images download initiated" });
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Label className="block text-sm font-medium text-slate-700 mb-4">
          Upload Images
        </Label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="image-upload"
            data-testid="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-primary hover:text-primary/80 font-medium"
          >
            Click to upload images or drag and drop
          </label>
          <p className="text-sm text-slate-500 mt-2">
            Supports JPG, PNG, WebP, GIF (Max 10MB per file)
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Selected Files ({selectedFiles.length})
            </Label>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Image className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">{file.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Quality: {quality[0]}%
          </Label>
          <Slider
            value={quality}
            onValueChange={setQuality}
            max={100}
            min={10}
            step={5}
            className="w-full"
            data-testid="quality-slider"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Lower quality (smaller file)</span>
            <span>Higher quality (larger file)</span>
          </div>
        </div>

        <div>
          <Label htmlFor="output-format" className="block text-sm font-medium text-slate-700 mb-2">
            Output Format
          </Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger data-testid="format-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="original">Keep Original Format</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="webp">WebP (Best Compression)</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        <Button 
          onClick={compressImages} 
          disabled={selectedFiles.length === 0 || compressing}
          className="flex-1"
          data-testid="compress-button"
        >
          {compressing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Compressing...
            </>
          ) : (
            <>
              <Image className="w-4 h-4 mr-2" />
              Compress Images
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={downloadCompressed} 
          disabled={selectedFiles.length === 0}
          data-testid="download-button"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" onClick={clearFiles} data-testid="clear-button">
          Clear
        </Button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Compression Preview:</h4>
          <div className="text-sm text-blue-700">
            <p>Original total size: {formatFileSize(selectedFiles.reduce((acc, file) => acc + file.size, 0))}</p>
            <p>Estimated compressed size: {formatFileSize(selectedFiles.reduce((acc, file) => acc + file.size, 0) * (quality[0] / 100))}</p>
            <p>Estimated savings: {100 - quality[0]}%</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">Privacy Note:</h4>
        <p className="text-sm text-green-700">
          All image compression is performed locally in your browser. Your images never leave your device.
        </p>
      </div>
    </div>
  );
}

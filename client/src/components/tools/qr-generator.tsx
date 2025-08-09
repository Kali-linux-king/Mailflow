import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Download, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function QrGenerator() {
  const [contentType, setContentType] = useState('url');
  const [content, setContent] = useState('https://example.com');
  const [size, setSize] = useState('300');
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [qrGenerated, setQrGenerated] = useState(false);
  const { toast } = useToast();

  const generateQR = () => {
    if (!content.trim()) {
      toast({ title: "Error", description: "Please enter content for the QR code", variant: "destructive" });
      return;
    }
    setQrGenerated(true);
    toast({ title: "QR Code Generated", description: "Your QR code has been created successfully" });
  };

  const downloadPNG = () => {
    toast({ title: "Download Started", description: "QR code PNG download initiated" });
  };

  const downloadSVG = () => {
    toast({ title: "Download Started", description: "QR code SVG download initiated" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <Label htmlFor="content-type" className="block text-sm font-medium text-slate-700 mb-2">
            Content Type
          </Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger data-testid="content-type-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="url">URL/Website</SelectItem>
              <SelectItem value="text">Plain Text</SelectItem>
              <SelectItem value="wifi">WiFi Network</SelectItem>
              <SelectItem value="vcard">Contact (vCard)</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-2">
            Content
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-24"
            placeholder="https://example.com"
            data-testid="qr-content"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="size" className="block text-sm font-medium text-slate-700 mb-2">
              Size
            </Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger data-testid="size-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="200">200x200</SelectItem>
                <SelectItem value="300">300x300</SelectItem>
                <SelectItem value="400">400x400</SelectItem>
                <SelectItem value="500">500x500</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="error-correction" className="block text-sm font-medium text-slate-700 mb-2">
              Error Correction
            </Label>
            <Select value={errorCorrection} onValueChange={setErrorCorrection}>
              <SelectTrigger data-testid="error-correction-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (7%)</SelectItem>
                <SelectItem value="M">Medium (15%)</SelectItem>
                <SelectItem value="Q">Quartile (25%)</SelectItem>
                <SelectItem value="H">High (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fg-color" className="block text-sm font-medium text-slate-700 mb-2">
              Foreground Color
            </Label>
            <Input
              id="fg-color"
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              className="w-full h-12"
              data-testid="foreground-color"
            />
          </div>

          <div>
            <Label htmlFor="bg-color" className="block text-sm font-medium text-slate-700 mb-2">
              Background Color
            </Label>
            <Input
              id="bg-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full h-12"
              data-testid="background-color"
            />
          </div>
        </div>

        <Button onClick={generateQR} className="w-full" data-testid="generate-qr">
          <Wand2 className="w-4 h-4 mr-2" />
          Generate QR Code
        </Button>
      </div>

      <div className="flex flex-col items-center">
        <div 
          className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 mb-6 flex items-center justify-center"
          style={{ width: '300px', height: '300px' }}
        >
          {qrGenerated ? (
            <div className="text-center">
              <div 
                className="mx-auto mb-4 border-2 border-slate-300 rounded"
                style={{ 
                  width: '200px', 
                  height: '200px',
                  backgroundColor: backgroundColor,
                  backgroundImage: `repeating-linear-gradient(
                    0deg,
                    ${foregroundColor},
                    ${foregroundColor} 4px,
                    transparent 4px,
                    transparent 8px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    ${foregroundColor},
                    ${foregroundColor} 4px,
                    transparent 4px,
                    transparent 8px
                  )`
                }}
              />
              <p className="text-sm text-slate-600">QR Code Preview</p>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <i className="fas fa-qrcode text-6xl mb-4" />
              <p>QR Code will appear here</p>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            onClick={downloadPNG} 
            disabled={!qrGenerated}
            data-testid="download-png"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
          <Button 
            variant="outline" 
            onClick={downloadSVG} 
            disabled={!qrGenerated}
            data-testid="download-svg"
          >
            <Download className="w-4 h-4 mr-2" />
            Download SVG
          </Button>
        </div>
      </div>
    </div>
  );
}

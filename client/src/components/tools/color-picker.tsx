import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Palette, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [rgbInput, setRgbInput] = useState({ r: 59, g: 130, b: 246 });
  const [hslInput, setHslInput] = useState({ h: 217, s: 91, l: 60 });
  const { toast } = useToast();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  const updateColor = (color: string) => {
    setSelectedColor(color);
    setHexInput(color);
    const rgb = hexToRgb(color);
    if (rgb) {
      setRgbInput(rgb);
      setHslInput(rgbToHsl(rgb.r, rgb.g, rgb.b));
    }
  };

  const updateFromHex = (hex: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      updateColor(hex);
    }
  };

  const updateFromRgb = (rgb: { r: number, g: number, b: number }) => {
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    updateColor(hex);
  };

  const updateFromHsl = (hsl: { h: number, s: number, l: number }) => {
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    updateColor(hex);
  };

  const copyToClipboard = async (text: string, format: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${format} value copied to clipboard` });
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    updateColor(randomColor);
  };

  const generatePalette = () => {
    const baseHsl = rgbToHsl(rgbInput.r, rgbInput.g, rgbInput.b);
    const palette = [];
    
    for (let i = 0; i < 5; i++) {
      const newHue = (baseHsl.h + (i * 30)) % 360;
      const newRgb = hslToRgb(newHue, baseHsl.s, baseHsl.l);
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
      palette.push(newHex);
    }
    
    return palette;
  };

  const palette = generatePalette();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Color Picker */}
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-4">
            Color Picker
          </Label>
          <div className="space-y-4">
            <div>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => updateColor(e.target.value)}
                className="w-full h-32 border-2 border-slate-300 rounded-lg cursor-pointer"
                data-testid="color-input"
              />
            </div>
            
            <div 
              className="w-full h-16 border-2 border-slate-300 rounded-lg"
              style={{ backgroundColor: selectedColor }}
            />

            <Button 
              onClick={generateRandomColor} 
              variant="outline" 
              className="w-full"
              data-testid="random-color"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Random Color
            </Button>
          </div>
        </div>

        {/* Color Values */}
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-4">
            Color Values
          </Label>
          <Tabs defaultValue="hex" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hex" data-testid="hex-tab">HEX</TabsTrigger>
              <TabsTrigger value="rgb" data-testid="rgb-tab">RGB</TabsTrigger>
              <TabsTrigger value="hsl" data-testid="hsl-tab">HSL</TabsTrigger>
            </TabsList>

            <TabsContent value="hex" className="space-y-4">
              <div>
                <Label htmlFor="hex-input" className="text-sm font-medium mb-2 block">HEX Value</Label>
                <div className="flex space-x-2">
                  <Input
                    id="hex-input"
                    value={hexInput}
                    onChange={(e) => setHexInput(e.target.value)}
                    onBlur={() => updateFromHex(hexInput)}
                    className="font-mono"
                    placeholder="#000000"
                    data-testid="hex-input"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(hexInput, 'HEX')}
                    data-testid="copy-hex"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rgb" className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs font-medium mb-1 block">R</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbInput.r}
                    onChange={(e) => {
                      const newRgb = { ...rgbInput, r: parseInt(e.target.value) || 0 };
                      setRgbInput(newRgb);
                      updateFromRgb(newRgb);
                    }}
                    className="text-sm"
                    data-testid="rgb-r"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">G</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbInput.g}
                    onChange={(e) => {
                      const newRgb = { ...rgbInput, g: parseInt(e.target.value) || 0 };
                      setRgbInput(newRgb);
                      updateFromRgb(newRgb);
                    }}
                    className="text-sm"
                    data-testid="rgb-g"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">B</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbInput.b}
                    onChange={(e) => {
                      const newRgb = { ...rgbInput, b: parseInt(e.target.value) || 0 };
                      setRgbInput(newRgb);
                      updateFromRgb(newRgb);
                    }}
                    className="text-sm"
                    data-testid="rgb-b"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Input
                  value={`rgb(${rgbInput.r}, ${rgbInput.g}, ${rgbInput.b})`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(`rgb(${rgbInput.r}, ${rgbInput.g}, ${rgbInput.b})`, 'RGB')}
                  data-testid="copy-rgb"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="hsl" className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs font-medium mb-1 block">H</Label>
                  <Input
                    type="number"
                    min="0"
                    max="360"
                    value={hslInput.h}
                    onChange={(e) => {
                      const newHsl = { ...hslInput, h: parseInt(e.target.value) || 0 };
                      setHslInput(newHsl);
                      updateFromHsl(newHsl);
                    }}
                    className="text-sm"
                    data-testid="hsl-h"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">S</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={hslInput.s}
                    onChange={(e) => {
                      const newHsl = { ...hslInput, s: parseInt(e.target.value) || 0 };
                      setHslInput(newHsl);
                      updateFromHsl(newHsl);
                    }}
                    className="text-sm"
                    data-testid="hsl-s"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-1 block">L</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={hslInput.l}
                    onChange={(e) => {
                      const newHsl = { ...hslInput, l: parseInt(e.target.value) || 0 };
                      setHslInput(newHsl);
                      updateFromHsl(newHsl);
                    }}
                    className="text-sm"
                    data-testid="hsl-l"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Input
                  value={`hsl(${hslInput.h}, ${hslInput.s}%, ${hslInput.l}%)`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(`hsl(${hslInput.h}, ${hslInput.s}%, ${hslInput.l}%)`, 'HSL')}
                  data-testid="copy-hsl"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Color Palette */}
      <div className="mb-8">
        <Label className="block text-sm font-medium text-slate-700 mb-4">
          Generated Palette
        </Label>
        <div className="grid grid-cols-5 gap-4">
          {palette.map((color, index) => (
            <div key={index} className="text-center">
              <div
                className="w-full h-20 border-2 border-slate-300 rounded-lg cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => updateColor(color)}
                data-testid={`palette-color-${index}`}
              />
              <p className="text-xs font-mono mt-2 text-slate-600">{color}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Color Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
          <Palette className="w-4 h-4 mr-2" />
          Color Information
        </h4>
        <div className="text-sm text-blue-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <strong>HEX:</strong> {hexInput}
          </div>
          <div>
            <strong>RGB:</strong> {rgbInput.r}, {rgbInput.g}, {rgbInput.b}
          </div>
          <div>
            <strong>HSL:</strong> {hslInput.h}°, {hslInput.s}%, {hslInput.l}%
          </div>
        </div>
      </div>
    </div>
  );
}

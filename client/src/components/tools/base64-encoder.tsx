import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Base64Encoder() {
  const [textInput, setTextInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [fileOutput, setFileOutput] = useState('');
  const { toast } = useToast();

  const encodeText = () => {
    if (!textInput) {
      toast({ title: "Error", description: "Please enter text to encode", variant: "destructive" });
      return;
    }
    const encoded = btoa(textInput);
    setTextOutput(encoded);
  };

  const decodeText = () => {
    if (!textInput) {
      toast({ title: "Error", description: "Please enter Base64 to decode", variant: "destructive" });
      return;
    }
    try {
      const decoded = atob(textInput);
      setTextOutput(decoded);
    } catch (error) {
      toast({ title: "Error", description: "Invalid Base64 string", variant: "destructive" });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInput(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1]; // Remove data:type;base64, prefix
        setFileOutput(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard" });
  };

  const clearAll = () => {
    setTextInput('');
    setTextOutput('');
    setFileInput(null);
    setFileOutput('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" data-testid="text-tab">Text Encode/Decode</TabsTrigger>
          <TabsTrigger value="file" data-testid="file-tab">File Encode</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="text-input" className="block text-sm font-medium text-slate-700 mb-2">
                Input Text / Base64
              </Label>
              <Textarea
                id="text-input"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-64 font-mono text-sm resize-none"
                placeholder="Enter text to encode or Base64 to decode..."
                data-testid="text-input"
              />
              <div className="flex space-x-2 mt-4">
                <Button onClick={encodeText} data-testid="encode-button">
                  Encode to Base64
                </Button>
                <Button variant="secondary" onClick={decodeText} data-testid="decode-button">
                  Decode from Base64
                </Button>
                <Button variant="outline" onClick={clearAll} data-testid="clear-button">
                  Clear
                </Button>
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-slate-700 mb-2">
                Output
              </Label>
              <div className="w-full h-64 p-4 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm overflow-auto">
                {textOutput ? (
                  <pre className="whitespace-pre-wrap break-all">{textOutput}</pre>
                ) : (
                  <div className="text-slate-500">Encoded/decoded text will appear here...</div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(textOutput)} 
                  disabled={!textOutput}
                  data-testid="copy-text"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="file" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium text-slate-700 mb-2">
                Upload File
              </Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-4 text-slate-400" />
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  data-testid="file-input"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-primary hover:text-primary/80"
                >
                  Click to upload file
                </label>
                {fileInput && (
                  <div className="mt-4 text-sm text-slate-600">
                    <p>Selected: {fileInput.name}</p>
                    <p>Size: {(fileInput.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium text-slate-700 mb-2">
                Base64 Output
              </Label>
              <div className="w-full h-64 p-4 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs overflow-auto">
                {fileOutput ? (
                  <pre className="whitespace-pre-wrap break-all">{fileOutput}</pre>
                ) : (
                  <div className="text-slate-500">Base64 encoded file will appear here...</div>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(fileOutput)} 
                  disabled={!fileOutput}
                  data-testid="copy-file"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UrlEncoder() {
  const [input, setInput] = useState('https://example.com/search?q=hello world&category=news');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const encodeUrl = () => {
    if (!input) {
      toast({ title: "Error", description: "Please enter a URL to encode", variant: "destructive" });
      return;
    }
    const encoded = encodeURIComponent(input);
    setOutput(encoded);
  };

  const decodeUrl = () => {
    if (!input) {
      toast({ title: "Error", description: "Please enter a URL to decode", variant: "destructive" });
      return;
    }
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
    } catch (error) {
      toast({ title: "Error", description: "Invalid encoded URL", variant: "destructive" });
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      toast({ title: "Copied!", description: "URL copied to clipboard" });
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="url-input" className="block text-sm font-medium text-slate-700 mb-2">
            Input URL
          </Label>
          <Textarea
            id="url-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 font-mono text-sm resize-none"
            placeholder="https://example.com/search?q=hello world&category=news"
            data-testid="url-input"
          />
          <div className="flex space-x-2 mt-4">
            <Button onClick={encodeUrl} data-testid="encode-button">
              Encode URL
            </Button>
            <Button variant="secondary" onClick={decodeUrl} data-testid="decode-button">
              Decode URL
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
            {output ? (
              <pre className="whitespace-pre-wrap break-all">{output}</pre>
            ) : (
              <div className="text-slate-500">Encoded/decoded URL will appear here...</div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyToClipboard} 
              disabled={!output}
              data-testid="copy-button"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">URL Encoding Examples:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Space:</strong> " " → "%20"</p>
          <p><strong>Plus:</strong> "+" → "%2B"</p>
          <p><strong>Ampersand:</strong> "&" → "%26"</p>
          <p><strong>Question mark:</strong> "?" → "%3F"</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function HashGenerator() {
  const [input, setInput] = useState('Hello, World!');
  const [algorithm, setAlgorithm] = useState('sha256');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Simple hash implementations for demo purposes
  const generateHash = async (text: string, algo: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    let hashBuffer: ArrayBuffer;
    
    switch (algo) {
      case 'sha1':
        hashBuffer = await crypto.subtle.digest('SHA-1', data);
        break;
      case 'sha256':
        hashBuffer = await crypto.subtle.digest('SHA-256', data);
        break;
      case 'sha384':
        hashBuffer = await crypto.subtle.digest('SHA-384', data);
        break;
      case 'sha512':
        hashBuffer = await crypto.subtle.digest('SHA-512', data);
        break;
      case 'md5':
        // MD5 is not supported by Web Crypto API, using a mock hash
        return 'MD5 not supported in browser - would be: ' + btoa(text).slice(0, 32);
      default:
        return 'Unknown algorithm';
    }
    
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateSingleHash = async () => {
    if (!input.trim()) {
      toast({ title: "Error", description: "Please enter text to hash", variant: "destructive" });
      return;
    }

    const hash = await generateHash(input, algorithm);
    setHashes({ [algorithm]: hash });
  };

  const generateAllHashes = async () => {
    if (!input.trim()) {
      toast({ title: "Error", description: "Please enter text to hash", variant: "destructive" });
      return;
    }

    const algorithms = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];
    const newHashes: Record<string, string> = {};
    
    for (const algo of algorithms) {
      newHashes[algo] = await generateHash(input, algo);
    }
    
    setHashes(newHashes);
  };

  const copyToClipboard = async (hash: string) => {
    await navigator.clipboard.writeText(hash);
    toast({ title: "Copied!", description: "Hash copied to clipboard" });
  };

  const clearAll = () => {
    setInput('');
    setHashes({});
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <Label htmlFor="hash-input" className="block text-sm font-medium text-slate-700 mb-2">
            Input Text
          </Label>
          <Textarea
            id="hash-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 font-mono text-sm resize-none"
            placeholder="Enter text to generate hash..."
            data-testid="hash-input"
          />
        </div>

        <div>
          <Label htmlFor="algorithm" className="block text-sm font-medium text-slate-700 mb-2">
            Hash Algorithm
          </Label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger data-testid="algorithm-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="md5">MD5 (128-bit)</SelectItem>
              <SelectItem value="sha1">SHA-1 (160-bit)</SelectItem>
              <SelectItem value="sha256">SHA-256 (256-bit)</SelectItem>
              <SelectItem value="sha384">SHA-384 (384-bit)</SelectItem>
              <SelectItem value="sha512">SHA-512 (512-bit)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        <Button onClick={generateSingleHash} data-testid="generate-single">
          Generate {algorithm.toUpperCase()}
        </Button>
        <Button variant="secondary" onClick={generateAllHashes} data-testid="generate-all">
          Generate All Hashes
        </Button>
        <Button variant="outline" onClick={clearAll} data-testid="clear-button">
          Clear
        </Button>
      </div>

      {Object.keys(hashes).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800">Generated Hashes</h3>
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-slate-700 uppercase">
                  {algo}
                </Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(hash)}
                  data-testid={`copy-${algo}`}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="font-mono text-sm break-all bg-white p-3 rounded border">
                {hash}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-amber-50 p-4 rounded-lg">
        <h4 className="font-semibold text-amber-800 mb-2">Security Note:</h4>
        <p className="text-sm text-amber-700">
          All hashing is performed locally in your browser. Your data never leaves your device.
          MD5 and SHA-1 are considered cryptographically broken and should not be used for security purposes.
        </p>
      </div>
    </div>
  );
}

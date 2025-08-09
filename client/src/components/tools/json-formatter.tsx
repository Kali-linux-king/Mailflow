import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function JsonFormatter() {
  const [input, setInput] = useState('{"name":"John","age":30}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);
  const { toast } = useToast();

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setIsValid(false);
      setOutput('');
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setError('');
      setIsValid(true);
      toast({ title: "Valid JSON", description: "Your JSON is syntactically correct" });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setIsValid(false);
      toast({ title: "Invalid JSON", description: err instanceof Error ? err.message : 'Invalid JSON', variant: "destructive" });
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      setIsValid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setIsValid(false);
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      toast({ title: "Copied!", description: "JSON copied to clipboard" });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="json-input" className="block text-sm font-medium text-slate-700 mb-2">
          Input JSON
        </Label>
        <Textarea
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 font-mono text-sm resize-none"
          placeholder='{"name":"John","age":30}'
          data-testid="json-input"
        />
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <Button onClick={formatJson} data-testid="format-button">
              Format
            </Button>
            <Button variant="secondary" onClick={validateJson} data-testid="validate-button">
              Validate
            </Button>
            <Button variant="outline" onClick={minifyJson} data-testid="minify-button">
              Minify
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!output} data-testid="copy-button">
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
        </div>
      </div>
      
      <div>
        <Label className="block text-sm font-medium text-slate-700 mb-2">
          Formatted Output
        </Label>
        <div className="w-full h-64 p-4 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm overflow-auto">
          {output ? (
            <pre className="whitespace-pre-wrap">{output}</pre>
          ) : (
            <div className="text-slate-500">Formatted JSON will appear here...</div>
          )}
        </div>
        
        <div className="mt-4">
          {isValid && !error ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-800">
                <Check className="w-4 h-4 mr-2" />
                <span className="text-sm">JSON is valid</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-800">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

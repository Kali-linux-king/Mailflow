import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CodeBeautifier() {
  const [language, setLanguage] = useState('javascript');
  const [input, setInput] = useState(`function hello(){console.log("Hello World");}`);
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const beautifyCode = () => {
    if (!input.trim()) {
      toast({ title: "Error", description: "Please enter code to beautify", variant: "destructive" });
      return;
    }

    // Simple beautification logic for demonstration
    let beautified = input;

    switch (language) {
      case 'javascript':
        beautified = beautifyJavaScript(input);
        break;
      case 'html':
        beautified = beautifyHTML(input);
        break;
      case 'css':
        beautified = beautifyCSS(input);
        break;
      case 'json':
        try {
          const parsed = JSON.parse(input);
          beautified = JSON.stringify(parsed, null, 2);
        } catch (error) {
          toast({ title: "Error", description: "Invalid JSON", variant: "destructive" });
          return;
        }
        break;
      default:
        beautified = input;
    }

    setOutput(beautified);
  };

  const beautifyJavaScript = (code: string): string => {
    // Basic JavaScript beautification
    return code
      .replace(/;/g, ';\n')
      .replace(/{/g, ' {\n  ')
      .replace(/}/g, '\n}')
      .replace(/,/g, ',\n  ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  };

  const beautifyHTML = (code: string): string => {
    // Basic HTML beautification
    return code
      .replace(/></g, '>\n<')
      .replace(/^\s*\n/gm, '')
      .split('\n')
      .map(line => line.trim())
      .join('\n');
  };

  const beautifyCSS = (code: string): string => {
    // Basic CSS beautification
    return code
      .replace(/;/g, ';\n  ')
      .replace(/{/g, ' {\n  ')
      .replace(/}/g, '\n}\n')
      .replace(/,/g, ',\n')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  };

  const minifyCode = () => {
    if (!input.trim()) {
      toast({ title: "Error", description: "Please enter code to minify", variant: "destructive" });
      return;
    }

    const minified = input
      .replace(/\s+/g, ' ')
      .replace(/;\s*/g, ';')
      .replace(/{\s*/g, '{')
      .replace(/\s*}/g, '}')
      .trim();

    setOutput(minified);
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      toast({ title: "Copied!", description: "Code copied to clipboard" });
    }
  };

  const downloadCode = () => {
    if (!output) return;

    const fileExtensions: Record<string, string> = {
      javascript: 'js',
      html: 'html',
      css: 'css',
      json: 'json',
      xml: 'xml'
    };

    const extension = fileExtensions[language] || 'txt';
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beautified.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-2">
          Language
        </Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-48" data-testid="language-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="xml">XML</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="code-input" className="block text-sm font-medium text-slate-700 mb-2">
            Input Code
          </Label>
          <Textarea
            id="code-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-96 font-mono text-sm resize-none"
            placeholder="Paste your code here..."
            data-testid="code-input"
          />
          <div className="flex space-x-2 mt-4">
            <Button onClick={beautifyCode} data-testid="beautify-button">
              Beautify
            </Button>
            <Button variant="secondary" onClick={minifyCode} data-testid="minify-button">
              Minify
            </Button>
            <Button variant="outline" onClick={clearAll} data-testid="clear-button">
              Clear
            </Button>
          </div>
        </div>

        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Formatted Output
          </Label>
          <div className="w-full h-96 p-4 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm overflow-auto">
            {output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-slate-500">Formatted code will appear here...</div>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-slate-600">
              {output && `Lines: ${output.split('\n').length} | Characters: ${output.length}`}
            </div>
            <div className="flex space-x-2">
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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={downloadCode} 
                disabled={!output}
                data-testid="download-button"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Note:</h4>
        <p className="text-sm text-yellow-700">
          This is a basic code formatter. For production code, consider using dedicated tools like Prettier, 
          ESLint, or language-specific formatters for better results.
        </p>
      </div>
    </div>
  );
}

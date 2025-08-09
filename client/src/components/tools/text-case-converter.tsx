import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Type, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TextCaseConverter() {
  const [input, setInput] = useState('Hello World! This is a Sample Text for Case Conversion.');
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const convertCases = () => {
    if (!input.trim()) {
      toast({ title: "Error", description: "Please enter text to convert", variant: "destructive" });
      return;
    }

    const conversions = {
      uppercase: input.toUpperCase(),
      lowercase: input.toLowerCase(),
      titleCase: input.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
      sentenceCase: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
      camelCase: input
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, ''),
      pascalCase: input
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
        .replace(/\s+/g, ''),
      snakeCase: input
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w_]/g, ''),
      kebabCase: input
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, ''),
      constantCase: input
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w_]/g, ''),
      dotCase: input
        .toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^\w.]/g, ''),
      pathCase: input
        .toLowerCase()
        .replace(/\s+/g, '/')
        .replace(/[^\w/]/g, ''),
      alternatingCase: input
        .split('')
        .map((char, index) => 
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join(''),
      inverseCase: input
        .split('')
        .map((char) => 
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        )
        .join(''),
      removeSpaces: input.replace(/\s+/g, ''),
      reverseText: input.split('').reverse().join('')
    };

    setOutputs(conversions);
  };

  const copyToClipboard = async (text: string, caseName: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${caseName} text copied to clipboard` });
  };

  const clearAll = () => {
    setInput('');
    setOutputs({});
  };

  const caseTypes = [
    { key: 'uppercase', name: 'UPPERCASE', description: 'All letters uppercase' },
    { key: 'lowercase', name: 'lowercase', description: 'All letters lowercase' },
    { key: 'titleCase', name: 'Title Case', description: 'First letter of each word capitalized' },
    { key: 'sentenceCase', name: 'Sentence case', description: 'First letter capitalized' },
    { key: 'camelCase', name: 'camelCase', description: 'First letter lowercase, subsequent words capitalized' },
    { key: 'pascalCase', name: 'PascalCase', description: 'Each word starts with uppercase' },
    { key: 'snakeCase', name: 'snake_case', description: 'Words separated by underscores' },
    { key: 'kebabCase', name: 'kebab-case', description: 'Words separated by hyphens' },
    { key: 'constantCase', name: 'CONSTANT_CASE', description: 'Uppercase with underscores' },
    { key: 'dotCase', name: 'dot.case', description: 'Words separated by dots' },
    { key: 'pathCase', name: 'path/case', description: 'Words separated by slashes' },
    { key: 'alternatingCase', name: 'aLtErNaTiNg CaSe', description: 'Alternating letter case' },
    { key: 'inverseCase', name: 'iNVERSE cASE', description: 'Inverted case of original' },
    { key: 'removeSpaces', name: 'NoSpaces', description: 'All spaces removed' },
    { key: 'reverseText', name: 'Reverse Text', description: 'Text reversed character by character' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Label htmlFor="text-input" className="block text-sm font-medium text-slate-700 mb-2">
          Input Text
        </Label>
        <Textarea
          id="text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 text-sm resize-none"
          placeholder="Enter text to convert between different cases..."
          data-testid="text-input"
        />
        <div className="flex space-x-4 mt-4">
          <Button onClick={convertCases} data-testid="convert-button">
            <Type className="w-4 h-4 mr-2" />
            Convert All Cases
          </Button>
          <Button variant="outline" onClick={clearAll} data-testid="clear-button">
            Clear
          </Button>
        </div>
      </div>

      {Object.keys(outputs).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseTypes.map(({ key, name, description }) => (
            <div key={key} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-slate-800">{name}</h3>
                  <p className="text-xs text-slate-500">{description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(outputs[key], name)}
                  data-testid={`copy-${key}`}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded p-3 font-mono text-sm min-h-[80px] overflow-auto">
                <div className="whitespace-pre-wrap break-words">
                  {outputs[key] || 'No output'}
                </div>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {outputs[key]?.length || 0} characters
              </div>
            </div>
          ))}
        </div>
      )}

      {Object.keys(outputs).length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
          <Type className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No Conversions Yet</h3>
          <p className="text-slate-500">Enter some text above and click "Convert All Cases" to see the results</p>
        </div>
      )}

      <div className="mt-8 bg-amber-50 p-4 rounded-lg">
        <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
          <RefreshCw className="w-4 h-4 mr-2" />
          Case Conversion Tips
        </h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• <strong>camelCase:</strong> Used in JavaScript variables and functions</li>
          <li>• <strong>PascalCase:</strong> Used for class names and component names</li>
          <li>• <strong>snake_case:</strong> Common in Python and database column names</li>
          <li>• <strong>kebab-case:</strong> Used in URLs and CSS class names</li>
          <li>• <strong>CONSTANT_CASE:</strong> Used for constants and environment variables</li>
        </ul>
      </div>
    </div>
  );
}

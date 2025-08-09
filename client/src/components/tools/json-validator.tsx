import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, FileJson, Info } from "lucide-react";
import { toast } from 'react-toastify';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  lineNumber?: number;
  position?: number;
  suggestion?: string;
}

export function JSONValidator() {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [jsonStats, setJsonStats] = useState<any>(null);

  const validateJSON = () => {
    if (!jsonInput.trim()) {
      toast.error('Please enter JSON to validate');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      
      // Calculate statistics
      const stats = calculateJSONStats(parsed, jsonInput);
      setJsonStats(stats);
      
      setValidationResult({
        isValid: true
      });
      
      toast.success('JSON is valid!');
    } catch (error: any) {
      const errorInfo = parseJSONError(error.message, jsonInput);
      setValidationResult({
        isValid: false,
        ...errorInfo
      });
      
      toast.error('Invalid JSON');
    }
  };

  const parseJSONError = (errorMessage: string, input: string) => {
    const positionMatch = errorMessage.match(/position (\d+)/);
    const position = positionMatch ? parseInt(positionMatch[1]) : undefined;
    
    let lineNumber = undefined;
    if (position !== undefined) {
      const lines = input.substring(0, position).split('\n');
      lineNumber = lines.length;
    }

    let suggestion = '';
    if (errorMessage.includes('Unexpected token')) {
      suggestion = 'Check for missing commas, quotes, or brackets';
    } else if (errorMessage.includes('Unexpected end')) {
      suggestion = 'Check for missing closing brackets or braces';
    } else if (errorMessage.includes('Unexpected string')) {
      suggestion = 'Check for missing commas between properties';
    }

    return {
      error: errorMessage,
      lineNumber,
      position,
      suggestion
    };
  };

  const calculateJSONStats = (parsed: any, input: string) => {
    const sizeBytes = new TextEncoder().encode(input).length;
    
    const countItems = (obj: any, type: string): number => {
      if (typeof obj !== 'object' || obj === null) return 0;
      
      let count = 0;
      if (Array.isArray(obj)) {
        if (type === 'arrays') count = 1;
        obj.forEach(item => count += countItems(item, type));
      } else {
        if (type === 'objects') count = 1;
        Object.values(obj).forEach(value => count += countItems(value, type));
      }
      
      return count;
    };

    const countProperties = (obj: any): number => {
      if (typeof obj !== 'object' || obj === null) return 0;
      
      let count = 0;
      if (Array.isArray(obj)) {
        obj.forEach(item => count += countProperties(item));
      } else {
        count = Object.keys(obj).length;
        Object.values(obj).forEach(value => count += countProperties(value));
      }
      
      return count;
    };

    const getDepth = (obj: any): number => {
      if (typeof obj !== 'object' || obj === null) return 0;
      
      let maxDepth = 0;
      if (Array.isArray(obj)) {
        obj.forEach(item => {
          maxDepth = Math.max(maxDepth, getDepth(item));
        });
      } else {
        Object.values(obj).forEach(value => {
          maxDepth = Math.max(maxDepth, getDepth(value));
        });
      }
      
      return maxDepth + 1;
    };

    return {
      size: formatBytes(sizeBytes),
      lines: input.split('\n').length,
      characters: input.length,
      objects: countItems(parsed, 'objects'),
      arrays: countItems(parsed, 'arrays'),
      properties: countProperties(parsed),
      depth: getDepth(parsed),
      type: Array.isArray(parsed) ? 'Array' : typeof parsed
    };
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      toast.success('JSON formatted successfully!');
    } catch (error) {
      toast.error('Cannot format invalid JSON');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      toast.success('JSON minified successfully!');
    } catch (error) {
      toast.error('Cannot minify invalid JSON');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">JSON Validator & Formatter</h1>
        <p className="text-gray-600">Validate JSON syntax, format, minify, and analyze JSON structure with detailed error reporting.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="w-5 h-5" />
            JSON Input
          </CardTitle>
          <CardDescription>
            Paste your JSON content below to validate and analyze
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={`{
  "name": "Example",
  "version": "1.0.0",
  "features": ["validation", "formatting"],
  "config": {
    "enabled": true,
    "maxSize": 1000
  }
}`}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          
          <div className="flex gap-2">
            <Button onClick={validateJSON} className="flex-1">
              <FileJson className="w-4 h-4 mr-2" />
              Validate JSON
            </Button>
            <Button variant="outline" onClick={formatJSON}>
              Format
            </Button>
            <Button variant="outline" onClick={minifyJSON}>
              Minify
            </Button>
          </div>
        </CardContent>
      </Card>

      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              Validation Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validationResult.isValid ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Valid JSON</span>
                </div>
                <p className="text-green-700 mt-1">Your JSON is properly formatted and valid.</p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Invalid JSON</span>
                </div>
                <p className="text-red-700 mb-2">{validationResult.error}</p>
                {validationResult.lineNumber && (
                  <p className="text-red-600 text-sm">Line: {validationResult.lineNumber}</p>
                )}
                {validationResult.suggestion && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Info className="w-4 h-4" />
                      <span className="font-medium">Suggestion</span>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">{validationResult.suggestion}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {jsonStats && (
        <Card>
          <CardHeader>
            <CardTitle>JSON Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{jsonStats.size}</div>
                <div className="text-sm text-blue-700">File Size</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{jsonStats.objects}</div>
                <div className="text-sm text-green-700">Objects</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">{jsonStats.arrays}</div>
                <div className="text-sm text-purple-700">Arrays</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">{jsonStats.depth}</div>
                <div className="text-sm text-orange-700">Max Depth</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Lines:</span>
                <span className="font-semibold">{jsonStats.lines}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Characters:</span>
                <span className="font-semibold">{jsonStats.characters}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Properties:</span>
                <span className="font-semibold">{jsonStats.properties}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
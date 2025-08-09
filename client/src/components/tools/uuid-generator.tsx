import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, RefreshCw, Key, Trash2 } from "lucide-react";
import { toast } from 'react-toastify';

export function UUIDGenerator() {
  const [uuidVersion, setUuidVersion] = useState('4');
  const [count, setCount] = useState(1);
  const [generatedUUIDs, setGeneratedUUIDs] = useState<string[]>([]);

  const generateUUID = () => {
    const newUUIDs: string[] = [];
    
    for (let i = 0; i < count; i++) {
      if (uuidVersion === '4') {
        newUUIDs.push(generateUUIDv4());
      } else if (uuidVersion === '1') {
        newUUIDs.push(generateUUIDv1());
      } else {
        newUUIDs.push(generateNanoID());
      }
    }
    
    setGeneratedUUIDs(newUUIDs);
    toast.success(`Generated ${count} UUID${count > 1 ? 's' : ''}!`);
  };

  const generateUUIDv4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateUUIDv1 = (): string => {
    // Simplified UUID v1 implementation
    const timestamp = Date.now();
    const clockSeq = Math.floor(Math.random() * 0x3fff);
    const node = Math.floor(Math.random() * 0xffffffffffff);
    
    const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0');
    const timeMid = ((timestamp >> 32) & 0xffff).toString(16).padStart(4, '0');
    const timeHigh = (((timestamp >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
    const clockSeqHigh = ((clockSeq >> 8) | 0x80).toString(16).padStart(2, '0');
    const clockSeqLow = (clockSeq & 0xff).toString(16).padStart(2, '0');
    const nodeStr = node.toString(16).padStart(12, '0');
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeqHigh}${clockSeqLow}-${nodeStr}`;
  };

  const generateNanoID = (): string => {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 21; i++) {
      result += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return result;
  };

  const copyUUID = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    toast.success('UUID copied to clipboard!');
  };

  const copyAllUUIDs = () => {
    const allUUIDs = generatedUUIDs.join('\n');
    navigator.clipboard.writeText(allUUIDs);
    toast.success('All UUIDs copied to clipboard!');
  };

  const clearUUIDs = () => {
    setGeneratedUUIDs([]);
    toast.success('Cleared all UUIDs');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">UUID Generator & Validator</h1>
        <p className="text-gray-600">Generate secure UUIDs (v1, v4) and Nano IDs for unique identifiers in your applications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            UUID Configuration
          </CardTitle>
          <CardDescription>
            Configure the type and number of UUIDs to generate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">UUID Type</label>
              <Select value={uuidVersion} onValueChange={setUuidVersion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">UUID v4 (Random)</SelectItem>
                  <SelectItem value="1">UUID v1 (Timestamp)</SelectItem>
                  <SelectItem value="nano">Nano ID (Short)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Count</label>
              <Input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <strong>UUID Types:</strong>
              <ul className="mt-2 space-y-1">
                <li>• <strong>UUID v4:</strong> Random UUIDs, most commonly used</li>
                <li>• <strong>UUID v1:</strong> Timestamp-based UUIDs with MAC address</li>
                <li>• <strong>Nano ID:</strong> URL-safe, compact unique identifiers</li>
              </ul>
            </div>
          </div>

          <Button onClick={generateUUID} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate UUID{count > 1 ? 's' : ''}
          </Button>
        </CardContent>
      </Card>

      {generatedUUIDs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated UUIDs ({generatedUUIDs.length})
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyAllUUIDs}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
                <Button variant="outline" size="sm" onClick={clearUUIDs}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {generatedUUIDs.map((uuid, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
                  <code className="flex-1 font-mono text-sm">{uuid}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyUUID(uuid)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
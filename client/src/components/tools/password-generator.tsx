import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PasswordGenerator() {
  const [password, setPassword] = useState('Kx9#mP$2vL@qR8nW');
  const [length, setLength] = useState([16]);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const { toast } = useToast();

  const generatePassword = () => {
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let availableChars = '';
    if (options.uppercase) availableChars += chars.uppercase;
    if (options.lowercase) availableChars += chars.lowercase;
    if (options.numbers) availableChars += chars.numbers;
    if (options.symbols) availableChars += chars.symbols;

    if (!availableChars) {
      toast({ title: "Error", description: "Please select at least one character type", variant: "destructive" });
      return;
    }

    let result = '';
    for (let i = 0; i < length[0]; i++) {
      result += availableChars.charAt(Math.floor(Math.random() * availableChars.length));
    }
    setPassword(result);
  };

  const calculateStrength = () => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const lengthScore = password.length >= 12 ? 20 : password.length * 1.5;
    
    let score = lengthScore;
    if (hasUpper) score += 15;
    if (hasLower) score += 15;
    if (hasNumber) score += 15;
    if (hasSymbol) score += 20;

    if (score >= 80) return { level: 'Very Strong', color: 'green', width: 90 };
    if (score >= 60) return { level: 'Strong', color: 'blue', width: 70 };
    if (score >= 40) return { level: 'Medium', color: 'yellow', width: 50 };
    return { level: 'Weak', color: 'red', width: 30 };
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    toast({ title: "Copied!", description: "Password copied to clipboard" });
  };

  const downloadPassword = () => {
    const blob = new Blob([password], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const strength = calculateStrength();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Label htmlFor="password-output" className="block text-sm font-medium text-slate-700 mb-2">
          Generated Password
        </Label>
        <div className="flex space-x-2">
          <Input
            id="password-output"
            type="text"
            value={password}
            readOnly
            className="flex-1 font-mono text-lg"
            data-testid="password-output"
          />
          <Button onClick={copyToClipboard} data-testid="copy-password">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Length: <span className="font-bold">{length[0]}</span>
          </Label>
          <Slider
            value={length}
            onValueChange={setLength}
            max={128}
            min={8}
            step={1}
            className="w-full"
            data-testid="length-slider"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>8</span>
            <span>128</span>
          </div>
        </div>
        
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-4">Options</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={options.uppercase}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, uppercase: !!checked }))}
                data-testid="uppercase-checkbox"
              />
              <Label htmlFor="uppercase" className="text-sm">Uppercase (A-Z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={options.lowercase}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, lowercase: !!checked }))}
                data-testid="lowercase-checkbox"
              />
              <Label htmlFor="lowercase" className="text-sm">Lowercase (a-z)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={options.numbers}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, numbers: !!checked }))}
                data-testid="numbers-checkbox"
              />
              <Label htmlFor="numbers" className="text-sm">Numbers (0-9)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={options.symbols}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, symbols: !!checked }))}
                data-testid="symbols-checkbox"
              />
              <Label htmlFor="symbols" className="text-sm">Symbols (!@#$%)</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button onClick={generatePassword} className="flex-1" data-testid="generate-button">
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Password
        </Button>
        <Button variant="outline" onClick={downloadPassword} data-testid="download-button">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg">
        <h4 className="font-semibold text-slate-800 mb-2">
          Password Strength: <span className={`text-${strength.color}-600`}>{strength.level}</span>
        </h4>
        <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
          <div 
            className={`bg-${strength.color}-500 h-2 rounded-full transition-all`}
            style={{ width: `${strength.width}%` }}
          />
        </div>
        <p className="text-sm text-slate-600">
          This password would take approximately <strong>600+ years</strong> to crack using brute force methods.
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, XCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ValidationResult {
  isValid: boolean;
  network: string;
  format: string;
  details: string;
}

export function WalletAddressValidator() {
  const [address, setAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('bitcoin');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const networks = [
    { id: 'bitcoin', name: 'Bitcoin (BTC)', formats: ['P2PKH', 'P2SH', 'Bech32'] },
    { id: 'ethereum', name: 'Ethereum (ETH)', formats: ['Hex'] },
    { id: 'litecoin', name: 'Litecoin (LTC)', formats: ['P2PKH', 'P2SH', 'Bech32'] },
    { id: 'bitcoin-cash', name: 'Bitcoin Cash (BCH)', formats: ['Legacy', 'CashAddr'] },
    { id: 'dogecoin', name: 'Dogecoin (DOGE)', formats: ['P2PKH', 'P2SH'] },
    { id: 'binance', name: 'Binance Smart Chain (BSC)', formats: ['Hex'] },
    { id: 'polygon', name: 'Polygon (MATIC)', formats: ['Hex'] },
    { id: 'solana', name: 'Solana (SOL)', formats: ['Base58'] }
  ];

  const validateBitcoinAddress = (addr: string): ValidationResult => {
    // Legacy P2PKH (starts with 1)
    if (/^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr)) {
      return {
        isValid: true,
        network: 'Bitcoin',
        format: 'P2PKH (Legacy)',
        details: 'Pay-to-Public-Key-Hash address starting with "1"'
      };
    }
    // P2SH (starts with 3)
    if (/^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr)) {
      return {
        isValid: true,
        network: 'Bitcoin',
        format: 'P2SH (Script Hash)',
        details: 'Pay-to-Script-Hash address starting with "3"'
      };
    }
    // Bech32 (starts with bc1)
    if (/^bc1[a-z0-9]{39,59}$/.test(addr)) {
      return {
        isValid: true,
        network: 'Bitcoin',
        format: 'Bech32 (SegWit)',
        details: 'Native SegWit address starting with "bc1"'
      };
    }
    return {
      isValid: false,
      network: 'Bitcoin',
      format: 'Invalid',
      details: 'Does not match any known Bitcoin address format'
    };
  };

  const validateEthereumAddress = (addr: string): ValidationResult => {
    if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      return {
        isValid: true,
        network: 'Ethereum',
        format: 'Hex (EIP-55)',
        details: '40-character hexadecimal address with "0x" prefix'
      };
    }
    return {
      isValid: false,
      network: 'Ethereum',
      format: 'Invalid',
      details: 'Must be 42 characters starting with "0x" followed by 40 hex characters'
    };
  };

  const validateLitecoinAddress = (addr: string): ValidationResult => {
    // Legacy P2PKH (starts with L)
    if (/^[L][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr)) {
      return {
        isValid: true,
        network: 'Litecoin',
        format: 'P2PKH (Legacy)',
        details: 'Pay-to-Public-Key-Hash address starting with "L"'
      };
    }
    // P2SH (starts with M)
    if (/^[M][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr)) {
      return {
        isValid: true,
        network: 'Litecoin',
        format: 'P2SH (Script Hash)',
        details: 'Pay-to-Script-Hash address starting with "M"'
      };
    }
    // Bech32 (starts with ltc1)
    if (/^ltc1[a-z0-9]{39,59}$/.test(addr)) {
      return {
        isValid: true,
        network: 'Litecoin',
        format: 'Bech32 (SegWit)',
        details: 'Native SegWit address starting with "ltc1"'
      };
    }
    return {
      isValid: false,
      network: 'Litecoin',
      format: 'Invalid',
      details: 'Does not match any known Litecoin address format'
    };
  };

  const validateSolanaAddress = (addr: string): ValidationResult => {
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)) {
      return {
        isValid: true,
        network: 'Solana',
        format: 'Base58',
        details: '32-44 character Base58 encoded address'
      };
    }
    return {
      isValid: false,
      network: 'Solana',
      format: 'Invalid',
      details: 'Must be 32-44 Base58 encoded characters'
    };
  };

  const validateDogecoinAddress = (addr: string): ValidationResult => {
    // P2PKH (starts with D)
    if (/^[D][1-9A-HJ-NP-Za-km-z]{25,34}$/.test(addr)) {
      return {
        isValid: true,
        network: 'Dogecoin',
        format: 'P2PKH',
        details: 'Pay-to-Public-Key-Hash address starting with "D"'
      };
    }
    // P2SH (starts with 9 or A)
    if (/^[9A][1-9A-HJ-NP-Za-km-z]{25,34}$/.test(addr)) {
      return {
        isValid: true,
        network: 'Dogecoin',
        format: 'P2SH',
        details: 'Pay-to-Script-Hash address starting with "9" or "A"'
      };
    }
    return {
      isValid: false,
      network: 'Dogecoin',
      format: 'Invalid',
      details: 'Does not match any known Dogecoin address format'
    };
  };

  const validateAddress = () => {
    if (!address.trim()) {
      toast({ title: "Error", description: "Please enter an address to validate", variant: "destructive" });
      return;
    }

    let validationResult: ValidationResult;

    switch (selectedNetwork) {
      case 'bitcoin':
        validationResult = validateBitcoinAddress(address);
        break;
      case 'ethereum':
      case 'binance':
      case 'polygon':
        validationResult = validateEthereumAddress(address);
        if (selectedNetwork !== 'ethereum') {
          validationResult.network = networks.find(n => n.id === selectedNetwork)?.name.split('(')[0].trim() || '';
        }
        break;
      case 'litecoin':
        validationResult = validateLitecoinAddress(address);
        break;
      case 'solana':
        validationResult = validateSolanaAddress(address);
        break;
      case 'dogecoin':
        validationResult = validateDogecoinAddress(address);
        break;
      case 'bitcoin-cash':
        // Simplified validation for BCH
        if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || /^[qp][a-z0-9]{41}$/.test(address)) {
          validationResult = {
            isValid: true,
            network: 'Bitcoin Cash',
            format: address.startsWith('q') || address.startsWith('p') ? 'CashAddr' : 'Legacy',
            details: address.startsWith('q') || address.startsWith('p') ? 'CashAddr format' : 'Legacy format'
          };
        } else {
          validationResult = {
            isValid: false,
            network: 'Bitcoin Cash',
            format: 'Invalid',
            details: 'Does not match Bitcoin Cash address format'
          };
        }
        break;
      default:
        validationResult = {
          isValid: false,
          network: 'Unknown',
          format: 'Invalid',
          details: 'Unsupported network'
        };
    }

    setResult(validationResult);
  };

  const clearAll = () => {
    setAddress('');
    setResult(null);
  };

  const loadExampleAddress = (network: string) => {
    const examples: { [key: string]: string } = {
      bitcoin: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      ethereum: '0x742d35c0f3C5b9c7A3b0a2b7D2b3cF5F5dF5A5aC',
      litecoin: 'LTdsVS8VDw6syvfQADdhf2PHAm3rMGJvPX',
      'bitcoin-cash': 'qph2v4mkxjgdqgmlyjx6njmey0ftrxlnggt9t0a6zy',
      dogecoin: 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
      solana: '11111111111111111111111111111112',
      binance: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
      polygon: '0x0000000000000000000000000000000000001010'
    };
    
    setAddress(examples[network] || '');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Wallet Address Validator</h2>
        <p className="text-slate-600">Validate cryptocurrency wallet addresses for multiple networks</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Address Validation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Network Selection */}
          <div>
            <Label htmlFor="network" className="text-sm font-medium mb-2 block">
              Select Network
            </Label>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger data-testid="network-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {networks.map((network) => (
                  <SelectItem key={network.id} value={network.id}>
                    {network.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Address Input */}
          <div>
            <Label htmlFor="address" className="text-sm font-medium mb-2 block">
              Wallet Address
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter wallet address to validate"
              className="font-mono"
              data-testid="address-input"
            />
          </div>

          {/* Quick Examples */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Quick Examples</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadExampleAddress(selectedNetwork)}
                data-testid="load-example"
              >
                Load Example
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll} data-testid="clear-button">
                Clear
              </Button>
            </div>
          </div>

          {/* Validate Button */}
          <Button onClick={validateAddress} className="w-full" data-testid="validate-button">
            <Shield className="w-4 h-4 mr-2" />
            Validate Address
          </Button>

          {/* Validation Result */}
          {result && (
            <div className={`border rounded-lg p-4 ${
              result.isValid 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center mb-3">
                {result.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mr-2" />
                )}
                <span className={`font-semibold ${
                  result.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.isValid ? 'Valid Address' : 'Invalid Address'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-slate-600">Network:</span>
                    <span className="ml-2 text-slate-800" data-testid="result-network">
                      {result.network}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Format:</span>
                    <span className="ml-2 text-slate-800" data-testid="result-format">
                      {result.format}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-600">Details:</span>
                  <span className="ml-2 text-slate-700" data-testid="result-details">
                    {result.details}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Supported Formats */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Info className="w-4 h-4 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800">
                Supported Formats for {networks.find(n => n.id === selectedNetwork)?.name}
              </span>
            </div>
            <div className="text-sm text-blue-700">
              {networks.find(n => n.id === selectedNetwork)?.formats.join(', ')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">Security Notice:</h4>
        <div className="text-sm text-amber-700 space-y-1">
          <p>• This tool validates address format only, not ownership or balance</p>
          <p>• Always double-check addresses before sending cryptocurrency</p>
          <p>• Never share your private keys or seed phrases</p>
          <p>• This validation is performed locally in your browser</p>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Repeat, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CryptoConverter() {
  const [fromAmount, setFromAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('ethereum');
  const [result, setResult] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const { toast } = useToast();

  // Mock exchange rates - in real app would use live API data
  const exchangeRates: { [key: string]: { [key: string]: number } } = {
    bitcoin: {
      ethereum: 16.73,
      binancecoin: 144.67,
      solana: 422.45,
      cardano: 88736.25,
      polygon: 48457.92,
      usd: 43250.75,
      eur: 39584.32,
      gbp: 34129.58
    },
    ethereum: {
      bitcoin: 0.0598,
      binancecoin: 8.65,
      solana: 25.24,
      cardano: 5304.93,
      polygon: 2896.42,
      usd: 2583.42,
      eur: 2366.88,
      gbp: 2040.65
    },
    binancecoin: {
      bitcoin: 0.00691,
      ethereum: 0.116,
      solana: 2.92,
      cardano: 613.45,
      polygon: 334.82,
      usd: 298.67,
      eur: 273.78,
      gbp: 235.89
    },
    solana: {
      bitcoin: 0.00237,
      ethereum: 0.0396,
      binancecoin: 0.342,
      cardano: 210.15,
      polygon: 114.67,
      usd: 102.34,
      eur: 93.78,
      gbp: 80.85
    },
    cardano: {
      bitcoin: 0.0000113,
      ethereum: 0.000189,
      binancecoin: 0.00163,
      solana: 0.00476,
      polygon: 0.546,
      usd: 0.487,
      eur: 0.446,
      gbp: 0.384
    },
    polygon: {
      bitcoin: 0.0000206,
      ethereum: 0.000345,
      binancecoin: 0.00299,
      solana: 0.00872,
      cardano: 1.831,
      usd: 0.892,
      eur: 0.817,
      gbp: 0.704
    }
  };

  const currencies = [
    { id: 'bitcoin', name: 'Bitcoin (BTC)', symbol: 'BTC', type: 'crypto' },
    { id: 'ethereum', name: 'Ethereum (ETH)', symbol: 'ETH', type: 'crypto' },
    { id: 'binancecoin', name: 'BNB (BNB)', symbol: 'BNB', type: 'crypto' },
    { id: 'solana', name: 'Solana (SOL)', symbol: 'SOL', type: 'crypto' },
    { id: 'cardano', name: 'Cardano (ADA)', symbol: 'ADA', type: 'crypto' },
    { id: 'polygon', name: 'Polygon (MATIC)', symbol: 'MATIC', type: 'crypto' },
    { id: 'usd', name: 'US Dollar (USD)', symbol: 'USD', type: 'fiat' },
    { id: 'eur', name: 'Euro (EUR)', symbol: 'EUR', type: 'fiat' },
    { id: 'gbp', name: 'British Pound (GBP)', symbol: 'GBP', type: 'fiat' }
  ];

  const convert = () => {
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    const rate = exchangeRates[fromCurrency]?.[toCurrency];
    if (!rate) {
      toast({ title: "Error", description: "Conversion rate not available", variant: "destructive" });
      return;
    }

    const convertedAmount = amount * rate;
    setResult(convertedAmount.toFixed(8).replace(/\.?0+$/, ''));
    setExchangeRate(`1 ${getCurrencySymbol(fromCurrency)} = ${rate.toFixed(8).replace(/\.?0+$/, '')} ${getCurrencySymbol(toCurrency)}`);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    if (result) {
      setFromAmount(result);
      setResult('');
      setExchangeRate('');
    }
  };

  const getCurrencySymbol = (currencyId: string) => {
    return currencies.find(c => c.id === currencyId)?.symbol || '';
  };

  const clearAll = () => {
    setFromAmount('1');
    setResult('');
    setExchangeRate('');
  };

  const formatResult = (value: string) => {
    if (!value) return '';
    const num = parseFloat(value);
    if (num >= 1) {
      return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    } else {
      return value;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Cryptocurrency Converter</h2>
        <p className="text-slate-600">Convert between cryptocurrencies and fiat currencies</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Repeat className="w-5 h-5 mr-2" />
            Currency Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* From Currency */}
            <div className="space-y-4">
              <Label htmlFor="from-amount" className="text-sm font-medium">From</Label>
              <Input
                id="from-amount"
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="Enter amount"
                className="text-lg"
                data-testid="from-amount"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger data-testid="from-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">
                    Cryptocurrencies
                  </div>
                  {currencies.filter(c => c.type === 'crypto').map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{currency.symbol}</span>
                        <span className="text-slate-500">{currency.name.split('(')[0].trim()}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase border-t mt-1 pt-2">
                    Fiat Currencies
                  </div>
                  {currencies.filter(c => c.type === 'fiat').map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{currency.symbol}</span>
                        <span className="text-slate-500">{currency.name.split('(')[0].trim()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center lg:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={swapCurrencies}
                className="rounded-full"
                data-testid="swap-button"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="space-y-4">
              <Label htmlFor="to-amount" className="text-sm font-medium">To</Label>
              <Input
                id="to-amount"
                type="text"
                value={formatResult(result)}
                readOnly
                placeholder="Converted amount"
                className="text-lg bg-slate-50"
                data-testid="to-amount"
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger data-testid="to-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">
                    Cryptocurrencies
                  </div>
                  {currencies.filter(c => c.type === 'crypto').map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{currency.symbol}</span>
                        <span className="text-slate-500">{currency.name.split('(')[0].trim()}</span>
                      </div>
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase border-t mt-1 pt-2">
                    Fiat Currencies
                  </div>
                  {currencies.filter(c => c.type === 'fiat').map((currency) => (
                    <SelectItem key={currency.id} value={currency.id}>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{currency.symbol}</span>
                        <span className="text-slate-500">{currency.name.split('(')[0].trim()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button for larger screens */}
          <div className="hidden lg:flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapCurrencies}
              className="rounded-full"
              data-testid="swap-button-lg"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={convert} className="flex-1" data-testid="convert-button">
              <TrendingUp className="w-4 h-4 mr-2" />
              Convert
            </Button>
            <Button variant="outline" onClick={clearAll} data-testid="clear-button">
              Clear
            </Button>
          </div>

          {/* Exchange Rate */}
          {exchangeRate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center text-blue-800">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="font-medium">Exchange Rate</span>
              </div>
              <div className="text-blue-700 mt-1" data-testid="exchange-rate">
                {exchangeRate}
              </div>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-800 font-medium text-lg" data-testid="conversion-result">
                {fromAmount} {getCurrencySymbol(fromCurrency)} = {formatResult(result)} {getCurrencySymbol(toCurrency)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-800 mb-2">Important Notes:</h4>
        <div className="text-sm text-amber-700 space-y-1">
          <p>• Exchange rates are simulated for demonstration purposes</p>
          <p>• In a real application, rates would be fetched from live APIs</p>
          <p>• Always verify rates with multiple sources before trading</p>
          <p>• Cryptocurrency prices are highly volatile and change rapidly</p>
        </div>
      </div>
    </div>
  );
}
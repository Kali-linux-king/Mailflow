import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, PieChart, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Holding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
}

export function CryptoPortfolioTracker() {
  const [holdings, setHoldings] = useState<Holding[]>([
    {
      id: '1',
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.5,
      buyPrice: 40000,
      currentPrice: 43250.75
    },
    {
      id: '2',
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 2.5,
      buyPrice: 2800,
      currentPrice: 2583.42
    }
  ]);

  const [newHolding, setNewHolding] = useState({
    symbol: '',
    name: '',
    amount: '',
    buyPrice: ''
  });

  const { toast } = useToast();

  const cryptocurrencies = [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.75 },
    { symbol: 'ETH', name: 'Ethereum', price: 2583.42 },
    { symbol: 'BNB', name: 'BNB', price: 298.67 },
    { symbol: 'SOL', name: 'Solana', price: 102.34 },
    { symbol: 'ADA', name: 'Cardano', price: 0.487 },
    { symbol: 'MATIC', name: 'Polygon', price: 0.892 },
    { symbol: 'DOT', name: 'Polkadot', price: 7.45 },
    { symbol: 'LINK', name: 'Chainlink', price: 14.82 }
  ];

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.amount || !newHolding.buyPrice) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const selectedCrypto = cryptocurrencies.find(c => c.symbol === newHolding.symbol);
    if (!selectedCrypto) {
      toast({ title: "Error", description: "Invalid cryptocurrency", variant: "destructive" });
      return;
    }

    const holding: Holding = {
      id: Date.now().toString(),
      symbol: selectedCrypto.symbol,
      name: selectedCrypto.name,
      amount: parseFloat(newHolding.amount),
      buyPrice: parseFloat(newHolding.buyPrice),
      currentPrice: selectedCrypto.price
    };

    setHoldings([...holdings, holding]);
    setNewHolding({ symbol: '', name: '', amount: '', buyPrice: '' });
    toast({ title: "Success", description: `Added ${holding.symbol} to your portfolio` });
  };

  const removeHolding = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
    toast({ title: "Removed", description: "Holding removed from portfolio" });
  };

  const calculateMetrics = () => {
    const totalInvested = holdings.reduce((sum, holding) => sum + (holding.amount * holding.buyPrice), 0);
    const currentValue = holdings.reduce((sum, holding) => sum + (holding.amount * holding.currentPrice), 0);
    const totalPnL = currentValue - totalInvested;
    const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return { totalInvested, currentValue, totalPnL, totalPnLPercentage };
  };

  const { totalInvested, currentValue, totalPnL, totalPnLPercentage } = calculateMetrics();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatCrypto = (amount: number, symbol: string) => {
    return `${amount.toFixed(6).replace(/\.?0+$/, '')} ${symbol}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Crypto Portfolio Tracker</h2>
        <p className="text-slate-600">Track your cryptocurrency investments and performance</p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Invested</p>
                <p className="text-2xl font-bold text-slate-900" data-testid="total-invested">
                  {formatCurrency(totalInvested)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Current Value</p>
                <p className="text-2xl font-bold text-slate-900" data-testid="current-value">
                  {formatCurrency(currentValue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="total-pnl">
                  {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                totalPnL >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {totalPnL >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">P&L Percentage</p>
                <p className={`text-2xl font-bold ${totalPnLPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`} data-testid="pnl-percentage">
                  {totalPnLPercentage >= 0 ? '+' : ''}{totalPnLPercentage.toFixed(2)}%
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                totalPnLPercentage >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {totalPnLPercentage >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-600" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Holding */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Holding
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="crypto-select" className="text-sm font-medium mb-2 block">
                Cryptocurrency
              </Label>
              <Select value={newHolding.symbol} onValueChange={(value) => {
                const crypto = cryptocurrencies.find(c => c.symbol === value);
                setNewHolding({
                  ...newHolding,
                  symbol: value,
                  name: crypto?.name || ''
                });
              }}>
                <SelectTrigger data-testid="crypto-select">
                  <SelectValue placeholder="Select crypto" />
                </SelectTrigger>
                <SelectContent>
                  {cryptocurrencies.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{crypto.symbol}</span>
                        <span className="text-slate-500">{crypto.name}</span>
                        <span className="text-slate-400">({formatCurrency(crypto.price)})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="any"
                value={newHolding.amount}
                onChange={(e) => setNewHolding({...newHolding, amount: e.target.value})}
                placeholder="0.00"
                data-testid="amount-input"
              />
            </div>

            <div>
              <Label htmlFor="buy-price" className="text-sm font-medium mb-2 block">
                Buy Price (USD)
              </Label>
              <Input
                id="buy-price"
                type="number"
                step="any"
                value={newHolding.buyPrice}
                onChange={(e) => setNewHolding({...newHolding, buyPrice: e.target.value})}
                placeholder="0.00"
                data-testid="buy-price-input"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={addHolding} className="w-full" data-testid="add-holding">
                <Plus className="w-4 h-4 mr-2" />
                Add Holding
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holdings List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {holdings.length === 0 ? (
            <div className="text-center py-8">
              <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No holdings in your portfolio yet.</p>
              <p className="text-slate-400 text-sm">Add your first cryptocurrency above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {holdings.map((holding) => {
                const currentValue = holding.amount * holding.currentPrice;
                const investedValue = holding.amount * holding.buyPrice;
                const pnl = currentValue - investedValue;
                const pnlPercentage = (pnl / investedValue) * 100;

                return (
                  <div key={holding.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                          {holding.symbol.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{holding.name}</h3>
                          <p className="text-sm text-slate-500">{holding.symbol}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={pnl >= 0 ? "default" : "destructive"}
                          className="flex items-center space-x-1"
                        >
                          {pnl >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>{pnl >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%</span>
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeHolding(holding.id)}
                          data-testid={`remove-${holding.symbol.toLowerCase()}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Holdings</p>
                        <p className="font-semibold">{formatCrypto(holding.amount, holding.symbol)}</p>
                      </div>
                      
                      <div>
                        <p className="text-slate-500">Buy Price</p>
                        <p className="font-semibold">{formatCurrency(holding.buyPrice)}</p>
                      </div>
                      
                      <div>
                        <p className="text-slate-500">Current Price</p>
                        <p className="font-semibold">{formatCurrency(holding.currentPrice)}</p>
                      </div>
                      
                      <div>
                        <p className="text-slate-500">Current Value</p>
                        <p className="font-semibold">{formatCurrency(currentValue)}</p>
                      </div>
                      
                      <div>
                        <p className="text-slate-500">P&L</p>
                        <p className={`font-semibold ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Allocation */}
      {holdings.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {holdings.map((holding) => {
                const currentValue = holding.amount * holding.currentPrice;
                const percentage = (currentValue / totalInvested) * 100;

                return (
                  <div key={holding.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                      <span className="font-medium">{holding.symbol}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-slate-600 w-12 text-right">
                        {percentage.toFixed(1)}%
                      </span>
                      <span className="text-sm text-slate-500 w-20 text-right">
                        {formatCurrency(currentValue)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
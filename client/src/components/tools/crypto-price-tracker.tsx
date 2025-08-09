import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Search, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

export function CryptoPriceTracker() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  // Mock data for demonstration - in real app would use API like CoinGecko
  const mockCryptoData: CryptoData[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      current_price: 43250.75,
      price_change_percentage_24h: 2.45,
      market_cap: 847529837492,
      total_volume: 23847293847,
      image: ''
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      current_price: 2583.42,
      price_change_percentage_24h: -1.23,
      market_cap: 310482937492,
      total_volume: 12847293847,
      image: ''
    },
    {
      id: 'binancecoin',
      name: 'BNB',
      symbol: 'BNB',
      current_price: 298.67,
      price_change_percentage_24h: 3.78,
      market_cap: 45829384729,
      total_volume: 1847293847,
      image: ''
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      current_price: 102.34,
      price_change_percentage_24h: 5.91,
      market_cap: 42938472949,
      total_volume: 2847293847,
      image: ''
    },
    {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      current_price: 0.487,
      price_change_percentage_24h: -2.45,
      market_cap: 17382947294,
      total_volume: 847293847,
      image: ''
    },
    {
      id: 'polygon',
      name: 'Polygon',
      symbol: 'MATIC',
      current_price: 0.892,
      price_change_percentage_24h: 1.67,
      market_cap: 8472938472,
      total_volume: 647293847,
      image: ''
    }
  ];

  const fetchCryptoData = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCryptos(mockCryptoData);
      setLastUpdated(new Date());
      toast({ title: "Updated", description: "Crypto prices refreshed successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch crypto data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Cryptocurrency Price Tracker</h2>
          <p className="text-slate-600">Real-time crypto prices and market data</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
              data-testid="crypto-search"
            />
          </div>
          
          <Button 
            onClick={fetchCryptoData} 
            disabled={loading}
            className="flex items-center gap-2"
            data-testid="refresh-button"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {lastUpdated && (
        <div className="text-sm text-slate-500 mb-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Crypto Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCryptos.map((crypto) => (
          <Card key={crypto.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {crypto.symbol.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{crypto.name}</CardTitle>
                    <p className="text-sm text-slate-500 uppercase">{crypto.symbol}</p>
                  </div>
                </div>
                
                <Badge 
                  variant={crypto.price_change_percentage_24h >= 0 ? "default" : "destructive"}
                  className="flex items-center space-x-1"
                >
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Current Price</p>
                  <p className="text-2xl font-bold text-slate-800" data-testid={`price-${crypto.symbol.toLowerCase()}`}>
                    {formatPrice(crypto.current_price)}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Market Cap</p>
                    <p className="font-semibold text-slate-700">
                      {formatMarketCap(crypto.market_cap)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-500">24h Volume</p>
                    <p className="font-semibold text-slate-700">
                      {formatMarketCap(crypto.total_volume)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCryptos.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">No cryptocurrencies found matching your search.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-slate-400 mx-auto mb-4 animate-spin" />
          <p className="text-slate-500">Loading crypto data...</p>
        </div>
      )}

      {/* Market Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Market Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {cryptos.filter(c => c.price_change_percentage_24h > 0).length}
              </p>
              <p className="text-sm text-slate-500">Gainers (24h)</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {cryptos.filter(c => c.price_change_percentage_24h < 0).length}
              </p>
              <p className="text-sm text-slate-500">Losers (24h)</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {formatMarketCap(cryptos.reduce((sum, c) => sum + c.market_cap, 0))}
              </p>
              <p className="text-sm text-slate-500">Total Market Cap</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
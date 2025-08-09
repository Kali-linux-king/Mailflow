import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Copy, Clock, Hash, Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  fee: string;
  timestamp: string;
  confirmations: number;
  status: 'confirmed' | 'pending' | 'failed';
}

interface Block {
  number: number;
  hash: string;
  timestamp: string;
  transactions: number;
  miner: string;
  difficulty: string;
  gasUsed: string;
  gasLimit: string;
}

interface Address {
  address: string;
  balance: string;
  transactionCount: number;
  firstSeen: string;
  lastActivity: string;
}

export function BlockchainExplorer() {
  const [searchType, setSearchType] = useState<'transaction' | 'block' | 'address'>('transaction');
  const [searchQuery, setSearchQuery] = useState('');
  const [blockchain, setBlockchain] = useState('ethereum');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const blockchains = [
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'binance', name: 'Binance Smart Chain', symbol: 'BNB' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' }
  ];

  // Mock data for demonstration
  const mockTransactionData: Transaction = {
    hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    from: '0x8ba1f109551bD432803012645Hac136c63F1a6B8',
    to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    amount: '1.5447',
    fee: '0.002156',
    timestamp: '2024-01-15 14:30:25 UTC',
    confirmations: 23847,
    status: 'confirmed'
  };

  const mockBlockData: Block = {
    number: 18950247,
    hash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    timestamp: '2024-01-15 14:30:25 UTC',
    transactions: 156,
    miner: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
    difficulty: '58750003716598352816469',
    gasUsed: '29,847,592',
    gasLimit: '30,000,000'
  };

  const mockAddressData: Address = {
    address: '0x8ba1f109551bD432803012645Hac136c63F1a6B8',
    balance: '15.4792',
    transactionCount: 847,
    firstSeen: '2021-03-15 10:22:45 UTC',
    lastActivity: '2024-01-15 14:30:25 UTC'
  };

  const mockTransactions: Transaction[] = [
    mockTransactionData,
    {
      ...mockTransactionData,
      hash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456aa',
      amount: '0.8921',
      timestamp: '2024-01-15 14:25:12 UTC',
      confirmations: 23852
    },
    {
      ...mockTransactionData,
      hash: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef123456bb',
      amount: '2.1156',
      timestamp: '2024-01-15 14:20:33 UTC',
      confirmations: 23856,
      status: 'pending' as const
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({ title: "Error", description: "Please enter a search query", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      switch (searchType) {
        case 'transaction':
          setResults({ type: 'transaction', data: mockTransactionData });
          break;
        case 'block':
          setResults({ type: 'block', data: mockBlockData });
          break;
        case 'address':
          setResults({ 
            type: 'address', 
            data: mockAddressData,
            transactions: mockTransactions 
          });
          break;
      }
      
      toast({ title: "Success", description: `Found ${searchType} details` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch blockchain data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const loadExample = () => {
    const examples = {
      transaction: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      block: '18950247',
      address: '0x8ba1f109551bD432803012645Hac136c63F1a6B8'
    };
    setSearchQuery(examples[searchType]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Blockchain Explorer</h2>
        <p className="text-slate-600">Search and explore blockchain transactions, blocks, and addresses</p>
      </div>

      {/* Search Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Blockchain Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="blockchain" className="text-sm font-medium mb-2 block">
                Select Blockchain
              </Label>
              <Select value={blockchain} onValueChange={setBlockchain}>
                <SelectTrigger data-testid="blockchain-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {blockchains.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      {chain.name} ({chain.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search-type" className="text-sm font-medium mb-2 block">
                Search Type
              </Label>
              <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                <SelectTrigger data-testid="search-type-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transaction">Transaction Hash</SelectItem>
                  <SelectItem value="block">Block Number/Hash</SelectItem>
                  <SelectItem value="address">Wallet Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="search-query" className="text-sm font-medium mb-2 block">
              Search Query
            </Label>
            <div className="flex gap-2">
              <Input
                id="search-query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Enter ${searchType} to search...`}
                className="font-mono text-sm"
                data-testid="search-input"
              />
              <Button variant="outline" onClick={loadExample} data-testid="load-example">
                Example
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="w-full"
            data-testid="search-button"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Searching...' : 'Search Blockchain'}
          </Button>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results && (
        <div className="space-y-6">
          {results.type === 'transaction' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Hash className="w-5 h-5 mr-2" />
                    Transaction Details
                  </CardTitle>
                  <Badge 
                    variant={results.data.status === 'confirmed' ? 'default' : 
                            results.data.status === 'pending' ? 'secondary' : 'destructive'}
                  >
                    {results.data.status.charAt(0).toUpperCase() + results.data.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Transaction Hash</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm flex-1 truncate">
                          {results.data.hash}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(results.data.hash, 'Transaction hash copied')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">From</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm flex-1 truncate">
                          {results.data.from}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(results.data.from, 'From address copied')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">To</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm flex-1 truncate">
                          {results.data.to}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(results.data.to, 'To address copied')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Amount</Label>
                      <p className="text-lg font-semibold text-slate-900 mt-1">
                        {results.data.amount} {blockchains.find(b => b.id === blockchain)?.symbol}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Transaction Fee</Label>
                      <p className="text-slate-800 font-medium mt-1">
                        {results.data.fee} {blockchains.find(b => b.id === blockchain)?.symbol}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Timestamp</Label>
                      <p className="text-slate-800 mt-1">{results.data.timestamp}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Confirmations</Label>
                      <p className="text-slate-800 font-medium mt-1">
                        {results.data.confirmations.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {results.type === 'block' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2" />
                  Block Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Block Number</Label>
                      <p className="text-2xl font-bold text-slate-900 mt-1">
                        #{results.data.number.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Block Hash</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm flex-1 truncate">
                          {results.data.hash}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(results.data.hash, 'Block hash copied')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Miner/Validator</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <code className="bg-slate-100 px-2 py-1 rounded text-sm flex-1 truncate">
                          {results.data.miner}
                        </code>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(results.data.miner, 'Miner address copied')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Timestamp</Label>
                      <p className="text-slate-800 mt-1">{results.data.timestamp}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Transactions</Label>
                      <p className="text-lg font-semibold text-slate-900 mt-1">
                        {results.data.transactions.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Gas Used / Limit</Label>
                      <p className="text-slate-800 mt-1">
                        {results.data.gasUsed} / {results.data.gasLimit}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Difficulty</Label>
                      <p className="text-slate-800 font-mono text-sm mt-1">
                        {results.data.difficulty}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {results.type === 'address' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hash className="w-5 h-5 mr-2" />
                    Address Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Address</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-slate-100 px-2 py-1 rounded text-sm flex-1 truncate">
                        {results.data.address}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(results.data.address, 'Address copied')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Balance</Label>
                      <p className="text-xl font-bold text-green-600 mt-1">
                        {results.data.balance} {blockchains.find(b => b.id === blockchain)?.symbol}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Transaction Count</Label>
                      <p className="text-xl font-bold text-slate-900 mt-1">
                        {results.data.transactionCount.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">First Seen</Label>
                      <p className="text-slate-800 mt-1">{results.data.firstSeen}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-slate-600">Last Activity</Label>
                      <p className="text-slate-800 mt-1">{results.data.lastActivity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.transactions.map((tx: Transaction, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-slate-400" />
                            <code className="text-sm bg-slate-100 px-2 py-1 rounded">
                              {formatHash(tx.hash)}
                            </code>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                              {tx.status}
                            </Badge>
                            <span className="text-sm text-slate-500">{tx.timestamp}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">From:</span>
                            <code className="ml-2 text-slate-800">{formatAddress(tx.from)}</code>
                          </div>
                          <div>
                            <span className="text-slate-500">To:</span>
                            <code className="ml-2 text-slate-800">{formatAddress(tx.to)}</code>
                          </div>
                          <div>
                            <span className="text-slate-500">Amount:</span>
                            <span className="ml-2 font-semibold text-slate-800">
                              {tx.amount} {blockchains.find(b => b.id === blockchain)?.symbol}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {loading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-500">Searching blockchain...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Demo Mode:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• This explorer uses simulated data for demonstration purposes</p>
          <p>• In production, it would connect to real blockchain APIs</p>
          <p>• Use the "Example" button to load sample search queries</p>
          <p>• All blockchain data shown is for educational purposes only</p>
        </div>
      </div>
    </div>
  );
}
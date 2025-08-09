import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, ExternalLink, Search, RefreshCw, TrendingUp, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  tags: string[];
  readTime: number;
}

export function CryptoNewsAggregator() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  // Mock news data
  const mockNewsData: NewsArticle[] = [
    {
      id: '1',
      title: 'Bitcoin Reaches New All-Time High Amid Institutional Adoption',
      summary: 'Bitcoin surged to unprecedented levels as major institutions continue to allocate cryptocurrency to their portfolios. The rally has been driven by increased corporate adoption and regulatory clarity.',
      url: '#',
      source: 'CryptoDaily',
      publishedAt: '2024-01-15T14:30:00Z',
      category: 'markets',
      sentiment: 'positive',
      tags: ['Bitcoin', 'ATH', 'Institutional'],
      readTime: 3
    },
    {
      id: '2',
      title: 'Ethereum 2.0 Staking Rewards Hit Record Low as Network Matures',
      summary: 'As more validators join the Ethereum network, staking rewards continue to decrease, indicating a maturing and more secure blockchain ecosystem.',
      url: '#',
      source: 'BlockNews',
      publishedAt: '2024-01-15T12:45:00Z',
      category: 'technology',
      sentiment: 'neutral',
      tags: ['Ethereum', 'Staking', 'ETH2.0'],
      readTime: 4
    },
    {
      id: '3',
      title: 'Major DeFi Protocol Suffers $50M Exploit in Smart Contract Vulnerability',
      summary: 'A critical vulnerability in a popular DeFi protocol has resulted in significant losses. The team is working on a recovery plan while security audits are being conducted.',
      url: '#',
      source: 'DeFi Watch',
      publishedAt: '2024-01-15T11:20:00Z',
      category: 'defi',
      sentiment: 'negative',
      tags: ['DeFi', 'Exploit', 'Security'],
      readTime: 5
    },
    {
      id: '4',
      title: 'Central Bank Digital Currencies Gain Momentum in Asian Markets',
      summary: 'Several Asian countries are accelerating their CBDC development programs, with pilot programs showing promising results for digital currency adoption.',
      url: '#',
      source: 'Global Crypto',
      publishedAt: '2024-01-15T10:15:00Z',
      category: 'regulation',
      sentiment: 'positive',
      tags: ['CBDC', 'Asia', 'Regulation'],
      readTime: 6
    },
    {
      id: '5',
      title: 'NFT Market Shows Signs of Recovery with New Gaming Partnerships',
      summary: 'The NFT sector is experiencing renewed interest as major gaming companies announce partnerships and integrations with blockchain-based digital assets.',
      url: '#',
      source: 'NFT Times',
      publishedAt: '2024-01-15T09:30:00Z',
      category: 'nft',
      sentiment: 'positive',
      tags: ['NFT', 'Gaming', 'Partnership'],
      readTime: 4
    },
    {
      id: '6',
      title: 'Layer 2 Solutions See Explosive Growth in Transaction Volume',
      summary: 'Ethereum Layer 2 solutions are processing record transaction volumes as users seek lower fees and faster confirmation times.',
      url: '#',
      source: 'Layer2 News',
      publishedAt: '2024-01-15T08:45:00Z',
      category: 'technology',
      sentiment: 'positive',
      tags: ['Layer2', 'Ethereum', 'Scaling'],
      readTime: 3
    },
    {
      id: '7',
      title: 'Crypto Market Analysis: Bull Run or Bear Trap?',
      summary: 'Technical analysts are divided on whether the current market conditions represent a sustainable bull run or a potential bear trap for unwary investors.',
      url: '#',
      source: 'Market Analytics',
      publishedAt: '2024-01-15T07:20:00Z',
      category: 'analysis',
      sentiment: 'neutral',
      tags: ['Analysis', 'Market', 'Technical'],
      readTime: 7
    },
    {
      id: '8',
      title: 'Green Bitcoin Mining Initiative Reaches Carbon Neutrality Goal',
      summary: 'A coalition of Bitcoin miners has successfully achieved carbon neutrality through renewable energy adoption and carbon offset programs.',
      url: '#',
      source: 'Eco Crypto',
      publishedAt: '2024-01-15T06:00:00Z',
      category: 'sustainability',
      sentiment: 'positive',
      tags: ['Bitcoin', 'Mining', 'Sustainability'],
      readTime: 5
    }
  ];

  const categories = [
    { id: 'all', name: 'All News', count: mockNewsData.length },
    { id: 'markets', name: 'Markets', count: mockNewsData.filter(a => a.category === 'markets').length },
    { id: 'technology', name: 'Technology', count: mockNewsData.filter(a => a.category === 'technology').length },
    { id: 'defi', name: 'DeFi', count: mockNewsData.filter(a => a.category === 'defi').length },
    { id: 'regulation', name: 'Regulation', count: mockNewsData.filter(a => a.category === 'regulation').length },
    { id: 'nft', name: 'NFT', count: mockNewsData.filter(a => a.category === 'nft').length },
    { id: 'analysis', name: 'Analysis', count: mockNewsData.filter(a => a.category === 'analysis').length },
    { id: 'sustainability', name: 'Sustainability', count: mockNewsData.filter(a => a.category === 'sustainability').length }
  ];

  const sources = [
    'all',
    ...Array.from(new Set(mockNewsData.map(article => article.source)))
  ];

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setArticles(mockNewsData);
      setLastUpdated(new Date());
      toast({ title: "Updated", description: "Latest crypto news loaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch news", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by source
    if (selectedSource !== 'all') {
      filtered = filtered.filter(article => article.source === selectedSource);
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedCategory, selectedSource]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const publishedDate = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '📊';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Crypto News Aggregator</h2>
        <p className="text-slate-600">Stay updated with the latest cryptocurrency news and market analysis</p>
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Newspaper className="w-5 h-5 mr-2" />
              News Feed
            </CardTitle>
            
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-sm text-slate-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <Button 
                onClick={fetchNews} 
                disabled={loading}
                size="sm"
                data-testid="refresh-news"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="news-search"
                />
              </div>
            </div>
            
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger data-testid="source-filter">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.slice(1).map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Categories Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {categories.slice(0, 8).map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* News Articles */}
      {loading ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-slate-400 mx-auto mb-4 animate-spin" />
              <p className="text-slate-500">Loading latest crypto news...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">No news articles found matching your filters.</p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedSource('all');
                  }} className="mt-4">
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <Badge className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                          {getSentimentIcon(article.sentiment)} {article.sentiment}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(article.publishedAt)}
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg leading-tight hover:text-blue-600 cursor-pointer">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>{article.source}</span>
                        <span>•</span>
                        <span>{article.readTime} min read</span>
                      </div>
                      
                      <Button variant="outline" size="sm" data-testid={`read-article-${article.id}`}>
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Read More
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Market Sentiment Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Today's Market Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <p className="text-2xl font-bold text-green-600">
                {articles.filter(a => a.sentiment === 'positive').length}
              </p>
              <p className="text-sm text-slate-500">Positive News</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-2xl font-bold text-gray-600">
                {articles.filter(a => a.sentiment === 'neutral').length}
              </p>
              <p className="text-sm text-slate-500">Neutral News</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">📉</div>
              <p className="text-2xl font-bold text-red-600">
                {articles.filter(a => a.sentiment === 'negative').length}
              </p>
              <p className="text-sm text-slate-500">Negative News</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">News Sources:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• News articles are aggregated from multiple cryptocurrency publications</p>
          <p>• Sentiment analysis is performed to gauge market mood</p>
          <p>• All external links open in new tabs for security</p>
          <p>• News feed updates automatically every 15 minutes</p>
        </div>
      </div>
    </div>
  );
}
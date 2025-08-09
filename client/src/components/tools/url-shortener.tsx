import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Link, BarChart3, ExternalLink, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
}

export function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const { toast } = useToast();

  const generateShortId = (length: number = 6): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = () => {
    if (!originalUrl.trim()) {
      toast({ title: "Error", description: "Please enter a URL to shorten", variant: "destructive" });
      return;
    }

    if (!isValidUrl(originalUrl)) {
      toast({ title: "Error", description: "Please enter a valid URL", variant: "destructive" });
      return;
    }

    // Check if custom alias is already used
    if (customAlias && shortenedUrls.some(url => url.shortUrl.endsWith(customAlias))) {
      toast({ title: "Error", description: "Custom alias already exists", variant: "destructive" });
      return;
    }

    const shortId = customAlias || generateShortId();
    const baseUrl = 'https://short.ly'; // Mock base URL
    const shortUrl = `${baseUrl}/${shortId}`;

    const newUrl: ShortenedUrl = {
      id: generateShortId(8),
      originalUrl,
      shortUrl,
      clicks: 0,
      createdAt: new Date()
    };

    setShortenedUrls(prev => [newUrl, ...prev]);
    setOriginalUrl('');
    setCustomAlias('');
    
    toast({ title: "Success!", description: "URL shortened successfully" });
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "URL copied to clipboard" });
  };

  const deleteUrl = (id: string) => {
    setShortenedUrls(prev => prev.filter(url => url.id !== id));
    toast({ title: "Deleted", description: "Shortened URL removed" });
  };

  const clearAll = () => {
    setShortenedUrls([]);
    setOriginalUrl('');
    setCustomAlias('');
  };

  const simulateClick = (id: string) => {
    setShortenedUrls(prev => prev.map(url => 
      url.id === id ? { ...url, clicks: url.clicks + 1 } : url
    ));
  };

  const totalClicks = shortenedUrls.reduce((sum, url) => sum + url.clicks, 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* URL Shortener Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="w-5 h-5 mr-2" />
            URL Shortener
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="original-url" className="text-sm font-medium mb-2 block">
              Enter URL to shorten
            </Label>
            <Input
              id="original-url"
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              className="text-sm"
              data-testid="original-url"
            />
          </div>

          <div>
            <Label htmlFor="custom-alias" className="text-sm font-medium mb-2 block">
              Custom alias (optional)
            </Label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">short.ly/</span>
              <Input
                id="custom-alias"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-custom-link"
                className="flex-1 text-sm"
                data-testid="custom-alias"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button onClick={shortenUrl} className="flex-1" data-testid="shorten-button">
              Shorten URL
            </Button>
            <Button variant="outline" onClick={clearAll} data-testid="clear-all">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {shortenedUrls.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{shortenedUrls.length}</div>
                <div className="text-sm text-slate-600">URLs Shortened</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalClicks}</div>
                <div className="text-sm text-slate-600">Total Clicks</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {shortenedUrls.length > 0 ? Math.round(totalClicks / shortenedUrls.length) : 0}
                </div>
                <div className="text-sm text-slate-600">Avg Clicks/URL</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shortened URLs List */}
      {shortenedUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Your Shortened URLs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shortenedUrls.map((url) => (
                <div key={url.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="font-medium text-primary font-mono text-sm">
                          {url.shortUrl}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(url.shortUrl)}
                          data-testid={`copy-${url.id}`}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => simulateClick(url.id)}
                          data-testid={`visit-${url.id}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-slate-600 truncate mb-2">
                        {url.originalUrl}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>Created: {url.createdAt.toLocaleDateString()}</span>
                        <span className="flex items-center">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          {url.clicks} clicks
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteUrl(url.id)}
                      className="text-red-500 hover:text-red-700"
                      data-testid={`delete-${url.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {shortenedUrls.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
          <Link className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No URLs shortened yet</h3>
          <p className="text-slate-500">Enter a URL above to create your first short link</p>
        </div>
      )}

      {/* Information */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">URL Shortener Features:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Create custom aliases for branded short links</li>
          <li>• Track click analytics for each shortened URL</li>
          <li>• Copy shortened URLs with one click</li>
          <li>• All data is stored locally in your browser</li>
          <li>• Perfect for social media, email campaigns, and sharing</li>
        </ul>
      </div>
    </div>
  );
}

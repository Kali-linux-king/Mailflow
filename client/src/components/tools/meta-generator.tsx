import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Globe, Share2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MetaGenerator() {
  const [title, setTitle] = useState('DevToolkit - Free Online Tools for Developers');
  const [description, setDescription] = useState('Boost your productivity with our comprehensive collection of 30+ free developer tools, SEO utilities, converters, and more. No registration required.');
  const [keywords, setKeywords] = useState('developer tools, SEO tools, online converter, JSON formatter, password generator');
  const [author, setAuthor] = useState('DevToolkit');
  const [url, setUrl] = useState('https://devtoolkit.com');
  const [imageUrl, setImageUrl] = useState('https://devtoolkit.com/og-image.jpg');
  const [siteName, setSiteName] = useState('DevToolkit');
  const [twitterUsername, setTwitterUsername] = useState('@devtoolkit');
  const [ogType, setOgType] = useState('website');
  const [language, setLanguage] = useState('en');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const { toast } = useToast();

  const generateBasicMeta = () => {
    return `<!-- Basic Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="${viewport}">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">
<meta name="language" content="${language}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">`;
  };

  const generateOpenGraph = () => {
    return `<!-- Open Graph Meta Tags -->
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${siteName}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${language}_US">`;
  };

  const generateTwitterCards = () => {
    return `<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="${twitterUsername}">
<meta name="twitter:creator" content="${twitterUsername}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${imageUrl}">
<meta name="twitter:url" content="${url}">`;
  };

  const generateSchemaMarkup = () => {
    return `<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "${siteName}",
  "url": "${url}",
  "description": "${description}",
  "author": {
    "@type": "Organization",
    "name": "${author}"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "${url}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>`;
  };

  const generateAllMeta = () => {
    return `${generateBasicMeta()}

${generateOpenGraph()}

${generateTwitterCards()}

${generateSchemaMarkup()}`;
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${type} meta tags copied to clipboard` });
  };

  const clearAll = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
    setAuthor('');
    setUrl('');
    setImageUrl('');
    setSiteName('');
    setTwitterUsername('');
  };

  const loadPreset = (preset: string) => {
    switch (preset) {
      case 'blog':
        setTitle('My Amazing Blog Post - Blog Name');
        setDescription('Read about the latest insights and tips in this comprehensive blog post that covers everything you need to know.');
        setKeywords('blog, insights, tips, guide');
        setOgType('article');
        break;
      case 'product':
        setTitle('Amazing Product - Company Name');
        setDescription('Discover our revolutionary product that solves your problems and makes your life easier. Try it today!');
        setKeywords('product, software, solution, tool');
        setOgType('product');
        break;
      case 'portfolio':
        setTitle('John Doe - Web Developer Portfolio');
        setDescription('Explore my portfolio showcasing web development projects, skills, and experience in creating amazing digital experiences.');
        setKeywords('portfolio, web developer, projects, skills');
        setOgType('profile');
        break;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                Page Title (50-60 characters recommended)
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Your page title"
                data-testid="title-input"
              />
              <div className="text-xs text-slate-500 mt-1">{title.length} characters</div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                Meta Description (150-160 characters recommended)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Your page description"
                className="h-20 resize-none"
                data-testid="description-input"
              />
              <div className="text-xs text-slate-500 mt-1">{description.length} characters</div>
            </div>

            <div>
              <Label htmlFor="keywords" className="text-sm font-medium mb-2 block">
                Keywords (comma-separated)
              </Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                data-testid="keywords-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author" className="text-sm font-medium mb-2 block">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  data-testid="author-input"
                />
              </div>
              <div>
                <Label htmlFor="language" className="text-sm font-medium mb-2 block">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger data-testid="language-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Share2 className="w-5 h-5 mr-2" />
              Social Media & SEO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="url" className="text-sm font-medium mb-2 block">Canonical URL</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                data-testid="url-input"
              />
            </div>

            <div>
              <Label htmlFor="image-url" className="text-sm font-medium mb-2 block">
                Open Graph Image URL (1200x630 recommended)
              </Label>
              <Input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                data-testid="image-url-input"
              />
            </div>

            <div>
              <Label htmlFor="site-name" className="text-sm font-medium mb-2 block">Site Name</Label>
              <Input
                id="site-name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Your website name"
                data-testid="site-name-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twitter-username" className="text-sm font-medium mb-2 block">
                  Twitter Username
                </Label>
                <Input
                  id="twitter-username"
                  value={twitterUsername}
                  onChange={(e) => setTwitterUsername(e.target.value)}
                  placeholder="@username"
                  data-testid="twitter-input"
                />
              </div>
              <div>
                <Label htmlFor="og-type" className="text-sm font-medium mb-2 block">Content Type</Label>
                <Select value={ogType} onValueChange={setOgType}>
                  <SelectTrigger data-testid="og-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="profile">Profile</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Presets */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => loadPreset('blog')} data-testid="preset-blog">
              Blog Post
            </Button>
            <Button variant="outline" onClick={() => loadPreset('product')} data-testid="preset-product">
              Product Page
            </Button>
            <Button variant="outline" onClick={() => loadPreset('portfolio')} data-testid="preset-portfolio">
              Portfolio
            </Button>
            <Button variant="outline" onClick={clearAll} data-testid="clear-all">
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Meta Tags */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" data-testid="all-tab">All Tags</TabsTrigger>
          <TabsTrigger value="basic" data-testid="basic-tab">Basic SEO</TabsTrigger>
          <TabsTrigger value="og" data-testid="og-tab">Open Graph</TabsTrigger>
          <TabsTrigger value="twitter" data-testid="twitter-tab">Twitter Cards</TabsTrigger>
          <TabsTrigger value="schema" data-testid="schema-tab">Schema.org</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Complete Meta Tags</CardTitle>
                <Button 
                  onClick={() => copyToClipboard(generateAllMeta(), 'All')}
                  data-testid="copy-all"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap border">
                {generateAllMeta()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Basic SEO Meta Tags
                </CardTitle>
                <Button 
                  onClick={() => copyToClipboard(generateBasicMeta(), 'Basic SEO')}
                  data-testid="copy-basic"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap border">
                {generateBasicMeta()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="og">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Open Graph Meta Tags</CardTitle>
                <Button 
                  onClick={() => copyToClipboard(generateOpenGraph(), 'Open Graph')}
                  data-testid="copy-og"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap border">
                {generateOpenGraph()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="twitter">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Twitter Card Meta Tags</CardTitle>
                <Button 
                  onClick={() => copyToClipboard(generateTwitterCards(), 'Twitter Cards')}
                  data-testid="copy-twitter"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap border">
                {generateTwitterCards()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Schema.org JSON-LD</CardTitle>
                <Button 
                  onClick={() => copyToClipboard(generateSchemaMarkup(), 'Schema.org')}
                  data-testid="copy-schema"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto whitespace-pre-wrap border">
                {generateSchemaMarkup()}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SEO Tips */}
      <div className="mt-8 bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">SEO & Social Media Best Practices:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• <strong>Title:</strong> Keep between 50-60 characters for optimal display in search results</li>
          <li>• <strong>Description:</strong> Write compelling 150-160 character descriptions that encourage clicks</li>
          <li>• <strong>Open Graph Image:</strong> Use 1200x630px images for best social media display</li>
          <li>• <strong>Keywords:</strong> Use relevant, specific keywords but avoid keyword stuffing</li>
          <li>• <strong>Schema.org:</strong> Helps search engines understand your content better</li>
        </ul>
      </div>
    </div>
  );
}

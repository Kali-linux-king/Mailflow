export type ToolCategory = 'developer' | 'image' | 'pdf' | 'seo' | 'calculator' | 'text';

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: string;
  iconColor: string;
  tags: string[];
  popular?: boolean;
  trending?: boolean;
  secure?: boolean;
  aiPowered?: boolean;
}

export const tools: Tool[] = [
  // Developer Tools (10)
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Format, validate, and beautify JSON data with syntax highlighting, error detection, and schema validation for developers.',
    category: 'developer',
    icon: 'FileJson',
    iconColor: 'tool-icon-blue',
    tags: ['json', 'format', 'validate', 'beautify', 'syntax', 'developer'],
    popular: true
  },
  {
    id: 'code-beautifier',
    title: 'Code Beautifier & Formatter',
    description: 'Format and beautify HTML, CSS, JavaScript, Python, PHP and 20+ programming languages with syntax highlighting and customizable indentation.',
    category: 'developer',
    icon: 'Code2',
    iconColor: 'tool-icon-purple',
    tags: ['html', 'css', 'javascript', 'format', 'beautify', 'minify', 'syntax']
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester & Builder',
    description: 'Test, debug, and build regular expressions with real-time matching, pattern explanations, and comprehensive regex library.',
    category: 'developer',
    icon: 'Search',
    iconColor: 'tool-icon-red',
    tags: ['regex', 'pattern', 'test', 'match', 'validation', 'builder']
  },
  {
    id: 'base64-encoder',
    title: 'Base64 Encoder/Decoder',
    description: 'Encode and decode text, images, and files to/from Base64 format with batch processing and validation for secure data transmission.',
    category: 'developer',
    icon: 'RotateCcw',
    iconColor: 'tool-icon-indigo',
    tags: ['base64', 'encode', 'decode', 'file', 'converter', 'security'],
    trending: true
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs, query parameters, and special characters for safe web transmission and API compatibility.',
    category: 'developer',
    icon: 'Link',
    iconColor: 'tool-icon-green',
    tags: ['url', 'encode', 'decode', 'query', 'parameter', 'api']
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator & Verifier',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512, and other cryptographic hash values for data integrity verification and password security.',
    category: 'developer',
    icon: 'Fingerprint',
    iconColor: 'tool-icon-orange',
    tags: ['hash', 'md5', 'sha256', 'security', 'checksum', 'crypto'],
    secure: true
  },
  {
    id: 'password-generator',
    title: 'Strong Password Generator',
    description: 'Generate ultra-secure passwords with customizable length, character sets, and strength analysis to protect your accounts.',
    category: 'developer',
    icon: 'Key',
    iconColor: 'tool-icon-pink',
    tags: ['password', 'security', 'random', 'strong', 'generator', 'safe'],
    popular: true
  },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum Text Generator',
    description: 'Generate placeholder text in multiple languages and formats for design mockups, development testing, and content prototyping.',
    category: 'developer',
    icon: 'FileText',
    iconColor: 'tool-icon-teal',
    tags: ['lorem', 'placeholder', 'text', 'generator', 'design', 'mockup']
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Token Decoder',
    description: 'Decode, verify, and analyze JSON Web Tokens (JWT) with header, payload inspection and signature validation.',
    category: 'developer',
    icon: 'Shield',
    iconColor: 'tool-icon-blue',
    tags: ['jwt', 'token', 'decode', 'auth', 'security', 'json'],
    secure: true
  },
  {
    id: 'api-tester',
    title: 'API Testing Tool',
    description: 'Test REST APIs with GET, POST, PUT, DELETE requests, custom headers, and response analysis for developers.',
    category: 'developer',
    icon: 'Zap',
    iconColor: 'tool-icon-yellow',
    tags: ['api', 'test', 'rest', 'http', 'request', 'postman'],
    popular: true
  },

  // Image & Media Tools (8)
  {
    id: 'image-compressor',
    title: 'Image Compressor & Optimizer',
    description: 'Compress JPEG, PNG, WebP images up to 90% smaller while maintaining visual quality perfect for web optimization and faster loading.',
    category: 'image',
    icon: 'Archive',
    iconColor: 'tool-icon-blue',
    tags: ['image', 'compress', 'optimize', 'resize', 'web', 'performance'],
    popular: true
  },
  {
    id: 'bg-remover',
    title: 'AI Background Remover',
    description: 'Remove backgrounds from photos instantly using advanced AI technology. Perfect for product photos, portraits, and graphics.',
    category: 'image',
    icon: 'Scissors',
    iconColor: 'tool-icon-purple',
    tags: ['background', 'remove', 'ai', 'photo', 'transparent', 'cutout'],
    aiPowered: true
  },
  {
    id: 'image-converter',
    title: 'Image Format Converter',
    description: 'Convert between 15+ image formats including JPG, PNG, WebP, GIF, BMP, TIFF with batch processing and quality control.',
    category: 'image',
    icon: 'RefreshCw',
    iconColor: 'tool-icon-green',
    tags: ['image', 'convert', 'format', 'batch', 'jpg', 'png', 'webp']
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Create custom QR codes for URLs, WiFi passwords, contact info, and text with logo embedding and multiple export formats.',
    category: 'image',
    icon: 'QrCode',
    iconColor: 'tool-icon-indigo',
    tags: ['qr', 'code', 'generate', 'wifi', 'url', 'contact', 'logo'],
    trending: true
  },
  {
    id: 'favicon-generator',
    title: 'Favicon Generator & Creator',
    description: 'Generate favicons in all required sizes (16x16 to 512x512) for websites, web apps, and mobile icons from any image.',
    category: 'image',
    icon: 'Globe',
    iconColor: 'tool-icon-red',
    tags: ['favicon', 'icon', 'website', 'mobile', 'app', 'generator']
  },
  {
    id: 'color-picker',
    title: 'Color Picker & Palette Generator',
    description: 'Extract colors from images, generate harmonious color palettes, and convert between HEX, RGB, HSL, and CMYK formats.',
    category: 'image',
    icon: 'Palette',
    iconColor: 'tool-icon-pink',
    tags: ['color', 'picker', 'palette', 'hex', 'rgb', 'generator', 'design']
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer & Cropper',
    description: 'Resize, crop, and scale images to exact dimensions with smart cropping, aspect ratio maintenance, and bulk processing.',
    category: 'image',
    icon: 'Crop',
    iconColor: 'tool-icon-orange',
    tags: ['resize', 'crop', 'scale', 'dimensions', 'aspect', 'ratio', 'bulk']
  },
  {
    id: 'svg-optimizer',
    title: 'SVG Optimizer & Minifier',
    description: 'Optimize and minify SVG files by removing unnecessary code, reducing file size while preserving quality and scalability.',
    category: 'image',
    icon: 'Minimize2',
    iconColor: 'tool-icon-teal',
    tags: ['svg', 'optimize', 'minify', 'vector', 'compress', 'clean']
  },

  // PDF & Document Tools (6)
  {
    id: 'pdf-merger',
    title: 'PDF Merger & Combiner',
    description: 'Merge multiple PDF files into one document with drag-and-drop interface, page ordering, and password protection options.',
    category: 'pdf',
    icon: 'FilePlus',
    iconColor: 'tool-icon-red',
    tags: ['pdf', 'merge', 'combine', 'join', 'documents', 'secure'],
    popular: true
  },
  {
    id: 'pdf-splitter',
    title: 'PDF Splitter & Page Extractor',
    description: 'Split large PDF files into individual pages or extract specific page ranges with preview and batch processing.',
    category: 'pdf',
    icon: 'FileX',
    iconColor: 'tool-icon-orange',
    tags: ['pdf', 'split', 'extract', 'pages', 'separate', 'divide']
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image Converter',
    description: 'Convert PDF pages to high-quality JPG, PNG images with custom DPI settings and batch conversion for presentations.',
    category: 'pdf',
    icon: 'FileImage',
    iconColor: 'tool-icon-blue',
    tags: ['pdf', 'image', 'convert', 'jpg', 'png', 'dpi', 'batch']
  },
  {
    id: 'word-counter',
    title: 'Advanced Word Counter',
    description: 'Count words, characters, paragraphs, sentences, and calculate reading time with detailed statistics and SEO metrics.',
    category: 'pdf',
    icon: 'Calculator',
    iconColor: 'tool-icon-green',
    tags: ['word', 'count', 'text', 'characters', 'reading', 'seo', 'stats']
  },
  {
    id: 'text-case-converter',
    title: 'Text Case Converter',
    description: 'Transform text between 10+ cases: UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more.',
    category: 'pdf',
    icon: 'Type',
    iconColor: 'tool-icon-purple',
    tags: ['text', 'case', 'convert', 'upper', 'lower', 'camel', 'snake']
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Compressor & Optimizer',
    description: 'Reduce PDF file sizes by up to 90% while maintaining quality, perfect for email attachments and web uploads.',
    category: 'pdf',
    icon: 'Archive',
    iconColor: 'tool-icon-indigo',
    tags: ['pdf', 'compress', 'reduce', 'size', 'optimize', 'email'],
    trending: true
  },

  // SEO & Marketing Tools (6)
  {
    id: 'meta-generator',
    title: 'SEO Meta Tag Generator',
    description: 'Generate complete SEO meta tags including title, description, keywords, Open Graph, and Twitter cards for maximum visibility.',
    category: 'seo',
    icon: 'Tags',
    iconColor: 'tool-icon-blue',
    tags: ['meta', 'seo', 'tags', 'title', 'description', 'og', 'twitter']
  },
  {
    id: 'keyword-density',
    title: 'Keyword Density Analyzer',
    description: 'Analyze keyword density, frequency, and distribution in your content with competitor comparison and SEO recommendations.',
    category: 'seo',
    icon: 'BarChart3',
    iconColor: 'tool-icon-green',
    tags: ['keyword', 'density', 'seo', 'analyze', 'frequency', 'content']
  },
  {
    id: 'url-shortener',
    title: 'Smart URL Shortener',
    description: 'Create branded short URLs with click tracking, QR codes, expiration dates, and comprehensive analytics dashboard.',
    category: 'seo',
    icon: 'LinkIcon',
    iconColor: 'tool-icon-indigo',
    tags: ['url', 'short', 'analytics', 'tracking', 'qr', 'brand'],
    popular: true
  },
  {
    id: 'og-preview',
    title: 'Social Media Preview Tool',
    description: 'Preview and optimize how your links appear on Facebook, Twitter, LinkedIn, and other social platforms with real-time editing.',
    category: 'seo',
    icon: 'Share2',
    iconColor: 'tool-icon-purple',
    tags: ['og', 'social', 'preview', 'facebook', 'twitter', 'linkedin']
  },
  {
    id: 'robots-generator',
    title: 'Robots.txt Generator',
    description: 'Generate and validate robots.txt files with sitemap integration, crawl delay settings, and search engine optimization.',
    category: 'seo',
    icon: 'Bot',
    iconColor: 'tool-icon-orange',
    tags: ['robots', 'seo', 'crawl', 'sitemap', 'google', 'bing']
  },
  {
    id: 'schema-generator',
    title: 'Schema Markup Generator',
    description: 'Generate JSON-LD structured data for articles, products, reviews, and events to enhance search engine rich snippets.',
    category: 'seo',
    icon: 'Code',
    iconColor: 'tool-icon-yellow',
    tags: ['schema', 'structured', 'data', 'json-ld', 'rich', 'snippets'],
    trending: true
  },

  // Calculators & Converters (6)
  {
    id: 'unit-converter',
    title: 'Universal Unit Converter',
    description: 'Convert between 1000+ units across length, weight, temperature, area, volume, speed, and energy with precision calculations.',
    category: 'calculator',
    icon: 'Ruler',
    iconColor: 'tool-icon-indigo',
    tags: ['unit', 'convert', 'measurement', 'length', 'weight', 'temperature']
  },
  {
    id: 'currency-converter',
    title: 'Live Currency Converter',
    description: 'Convert between 170+ world currencies with real-time exchange rates, historical charts, and rate alerts.',
    category: 'calculator',
    icon: 'DollarSign',
    iconColor: 'tool-icon-green',
    tags: ['currency', 'convert', 'exchange', 'rates', 'forex', 'money'],
    popular: true
  },
  {
    id: 'timestamp-converter',
    title: 'Unix Timestamp Converter',
    description: 'Convert Unix timestamps to human-readable dates and vice versa with timezone support and batch processing.',
    category: 'calculator',
    icon: 'Clock',
    iconColor: 'tool-icon-blue',
    tags: ['timestamp', 'date', 'unix', 'time', 'timezone', 'epoch']
  },
  {
    id: 'percentage-calculator',
    title: 'Advanced Percentage Calculator',
    description: 'Calculate percentages, percentage changes, tips, discounts, tax, and compound interest with step-by-step solutions.',
    category: 'calculator',
    icon: 'Percent',
    iconColor: 'tool-icon-orange',
    tags: ['percentage', 'calculate', 'ratio', 'discount', 'tax', 'tip']
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator & Counter',
    description: 'Calculate exact age in years, months, days, hours, and minutes with birthday countdown and life statistics.',
    category: 'calculator',
    icon: 'Calendar',
    iconColor: 'tool-icon-purple',
    tags: ['age', 'calculate', 'birthday', 'countdown', 'date', 'years']
  },
  {
    id: 'bmi-calculator',
    title: 'BMI & Health Calculator',
    description: 'Calculate BMI, ideal weight, body fat percentage, and calorie needs with health recommendations and charts.',
    category: 'calculator',
    icon: 'Activity',
    iconColor: 'tool-icon-pink',
    tags: ['bmi', 'health', 'weight', 'fitness', 'calorie', 'body'],
    trending: true
  },

  // Text & Content Tools (4)
  {
    id: 'markdown-converter',
    title: 'Markdown to HTML Converter',
    description: 'Convert Markdown to HTML with live preview, syntax highlighting, and support for tables, code blocks, and custom styling.',
    category: 'text',
    icon: 'FileText',
    iconColor: 'tool-icon-purple',
    tags: ['markdown', 'html', 'convert', 'preview', 'syntax', 'tables']
  },
  {
    id: 'html-encoder',
    title: 'HTML Entity Encoder/Decoder',
    description: 'Encode and decode HTML entities, special characters, and symbols for safe web display and data transmission.',
    category: 'text',
    icon: 'Code',
    iconColor: 'tool-icon-red',
    tags: ['html', 'encode', 'entities', 'characters', 'symbols', 'decode']
  },
  {
    id: 'text-diff-checker',
    title: 'Text Difference Checker',
    description: 'Compare two texts and highlight differences, additions, and deletions with side-by-side or unified diff views.',
    category: 'text',
    icon: 'GitCompare',
    iconColor: 'tool-icon-blue',
    tags: ['text', 'diff', 'compare', 'changes', 'differences', 'merge'],
    popular: true
  },
  {
    id: 'lorem-generator',
    title: 'Lorem Ipsum & Text Generator',
    description: 'Generate Lorem Ipsum, random words, sentences, and paragraphs in multiple languages for design and testing.',
    category: 'text',
    icon: 'AlignLeft',
    iconColor: 'tool-icon-green',
    tags: ['lorem', 'ipsum', 'text', 'generator', 'random', 'placeholder']
  },

  // Crypto & Security (removed - moved to other categories as needed)
];

export const categories = [
  { id: 'all', name: 'All Tools', icon: 'Grid3X3', count: tools.length },
  { id: 'developer', name: 'Developer Tools', icon: 'Code2', count: tools.filter(t => t.category === 'developer').length },
  { id: 'image', name: 'Image & Media', icon: 'Image', count: tools.filter(t => t.category === 'image').length },
  { id: 'pdf', name: 'PDF & Documents', icon: 'FileText', count: tools.filter(t => t.category === 'pdf').length },
  { id: 'seo', name: 'SEO & Marketing', icon: 'TrendingUp', count: tools.filter(t => t.category === 'seo').length },
  { id: 'calculator', name: 'Calculators', icon: 'Calculator', count: tools.filter(t => t.category === 'calculator').length },
  { id: 'text', name: 'Text & Content', icon: 'Type', count: tools.filter(t => t.category === 'text').length }
];

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

export function getToolsByCategory(category: ToolCategory | 'all'): Tool[] {
  if (category === 'all') return tools;
  return tools.filter(tool => tool.category === category);
}

export function searchTools(query: string): Tool[] {
  const lowercaseQuery = query.toLowerCase();
  return tools.filter(tool => 
    tool.title.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

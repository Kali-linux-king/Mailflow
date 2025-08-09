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
  // Developer Tools (8)
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data with syntax highlighting and error detection.',
    category: 'developer',
    icon: 'brackets-curly',
    iconColor: 'tool-icon-blue',
    tags: ['json', 'format', 'validate'],
    popular: true
  },
  {
    id: 'code-beautifier',
    title: 'Code Beautifier',
    description: 'Format and beautify HTML, CSS, JavaScript, and other code languages.',
    category: 'developer',
    icon: 'code',
    iconColor: 'tool-icon-purple',
    tags: ['html', 'css', 'javascript', 'format']
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test and debug regular expressions with real-time matching and explanations.',
    category: 'developer',
    icon: 'search-plus',
    iconColor: 'tool-icon-red',
    tags: ['regex', 'pattern', 'test']
  },
  {
    id: 'base64-encoder',
    title: 'Base64 Encoder/Decoder',
    description: 'Encode and decode text or files to/from Base64 format.',
    category: 'developer',
    icon: 'exchange-alt',
    iconColor: 'tool-icon-indigo',
    tags: ['base64', 'encode', 'decode'],
    trending: true
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs for safe transmission and compatibility.',
    category: 'developer',
    icon: 'link',
    iconColor: 'tool-icon-green',
    tags: ['url', 'encode', 'decode']
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and other hash values for data integrity.',
    category: 'developer',
    icon: 'fingerprint',
    iconColor: 'tool-icon-orange',
    tags: ['hash', 'md5', 'sha256', 'security'],
    secure: true
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate strong, secure passwords with customizable criteria and strength analysis.',
    category: 'developer',
    icon: 'key',
    iconColor: 'tool-icon-pink',
    tags: ['password', 'security', 'random'],
    popular: true
  },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for design and development projects.',
    category: 'developer',
    icon: 'paragraph',
    iconColor: 'tool-icon-teal',
    tags: ['lorem', 'placeholder', 'text']
  },

  // Image & Media Tools (6)
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Reduce image file sizes while maintaining quality for web optimization.',
    category: 'image',
    icon: 'compress',
    iconColor: 'tool-icon-blue',
    tags: ['image', 'compress', 'optimize'],
    popular: true
  },
  {
    id: 'bg-remover',
    title: 'Background Remover',
    description: 'Automatically remove backgrounds from images using AI technology.',
    category: 'image',
    icon: 'cut',
    iconColor: 'tool-icon-purple',
    tags: ['background', 'remove', 'ai'],
    aiPowered: true
  },
  {
    id: 'image-converter',
    title: 'Image Format Converter',
    description: 'Convert between JPG, PNG, WebP, GIF and other image formats.',
    category: 'image',
    icon: 'exchange-alt',
    iconColor: 'tool-icon-green',
    tags: ['image', 'convert', 'format']
  },
  {
    id: 'qr-generator',
    title: 'QR Code Generator',
    description: 'Create customizable QR codes for URLs, text, WiFi, and more.',
    category: 'image',
    icon: 'qrcode',
    iconColor: 'tool-icon-indigo',
    tags: ['qr', 'code', 'generate'],
    trending: true
  },
  {
    id: 'favicon-generator',
    title: 'Favicon Generator',
    description: 'Generate favicons in all required sizes for websites and web apps.',
    category: 'image',
    icon: 'globe',
    iconColor: 'tool-icon-red',
    tags: ['favicon', 'icon', 'website']
  },
  {
    id: 'color-picker',
    title: 'Color Picker',
    description: 'Pick, convert, and generate color palettes with HEX, RGB, and HSL values.',
    category: 'image',
    icon: 'palette',
    iconColor: 'tool-icon-pink',
    tags: ['color', 'picker', 'palette']
  },

  // PDF & Document Tools (5)
  {
    id: 'pdf-merger',
    title: 'PDF Merger',
    description: 'Combine multiple PDF files into a single document easily and securely.',
    category: 'pdf',
    icon: 'file-pdf',
    iconColor: 'tool-icon-red',
    tags: ['pdf', 'merge', 'combine'],
    popular: true
  },
  {
    id: 'pdf-splitter',
    title: 'PDF Splitter',
    description: 'Split PDF files into separate pages or extract specific pages.',
    category: 'pdf',
    icon: 'cut',
    iconColor: 'tool-icon-orange',
    tags: ['pdf', 'split', 'extract']
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image Converter',
    description: 'Convert PDF pages to high-quality images in various formats.',
    category: 'pdf',
    icon: 'file-image',
    iconColor: 'tool-icon-blue',
    tags: ['pdf', 'image', 'convert']
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, paragraphs, and reading time for any text.',
    category: 'pdf',
    icon: 'calculator',
    iconColor: 'tool-icon-green',
    tags: ['word', 'count', 'text']
  },
  {
    id: 'text-case-converter',
    title: 'Text Case Converter',
    description: 'Convert text between different cases: UPPER, lower, Title, camelCase, and more.',
    category: 'pdf',
    icon: 'font',
    iconColor: 'tool-icon-purple',
    tags: ['text', 'case', 'convert']
  },

  // SEO & Marketing Tools (5)
  {
    id: 'meta-generator',
    title: 'Meta Tag Generator',
    description: 'Generate SEO-optimized meta tags for better search engine visibility.',
    category: 'seo',
    icon: 'tags',
    iconColor: 'tool-icon-blue',
    tags: ['meta', 'seo', 'tags']
  },
  {
    id: 'keyword-density',
    title: 'Keyword Density Checker',
    description: 'Analyze keyword density and frequency in your content for SEO optimization.',
    category: 'seo',
    icon: 'search',
    iconColor: 'tool-icon-green',
    tags: ['keyword', 'density', 'seo']
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    description: 'Create short URLs with analytics tracking and custom domains.',
    category: 'seo',
    icon: 'link',
    iconColor: 'tool-icon-indigo',
    tags: ['url', 'short', 'analytics'],
    popular: true
  },
  {
    id: 'og-preview',
    title: 'Open Graph Preview',
    description: 'Preview how your content will look when shared on social media platforms.',
    category: 'seo',
    icon: 'share-alt',
    iconColor: 'tool-icon-purple',
    tags: ['og', 'social', 'preview']
  },
  {
    id: 'robots-generator',
    title: 'Robots.txt Generator',
    description: 'Generate robots.txt files to control search engine crawling.',
    category: 'seo',
    icon: 'robot',
    iconColor: 'tool-icon-orange',
    tags: ['robots', 'seo', 'crawl']
  },

  // Calculators & Converters (4)
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert between various units of measurement: length, weight, temperature, and more.',
    category: 'calculator',
    icon: 'ruler',
    iconColor: 'tool-icon-indigo',
    tags: ['unit', 'convert', 'measurement']
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter',
    description: 'Convert between different currencies with real-time exchange rates.',
    category: 'calculator',
    icon: 'dollar-sign',
    iconColor: 'tool-icon-green',
    tags: ['currency', 'convert', 'exchange']
  },
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates.',
    category: 'calculator',
    icon: 'clock',
    iconColor: 'tool-icon-blue',
    tags: ['timestamp', 'date', 'unix']
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Calculate percentages, percentage increase/decrease, and ratios.',
    category: 'calculator',
    icon: 'percent',
    iconColor: 'tool-icon-orange',
    tags: ['percentage', 'calculate', 'ratio']
  },

  // Text & Content Tools (2)
  {
    id: 'markdown-converter',
    title: 'Markdown to HTML Converter',
    description: 'Convert Markdown text to HTML with live preview and syntax highlighting.',
    category: 'text',
    icon: 'markdown',
    iconColor: 'tool-icon-purple',
    tags: ['markdown', 'html', 'convert']
  },
  {
    id: 'html-encoder',
    title: 'HTML Encoder/Decoder',
    description: 'Encode and decode HTML entities for safe display in web browsers.',
    category: 'text',
    icon: 'code',
    iconColor: 'tool-icon-red',
    tags: ['html', 'encode', 'entities']
  }
];

export const categories = [
  { id: 'all', name: 'All Tools', icon: 'th-large', count: tools.length },
  { id: 'developer', name: 'Developer', icon: 'code', count: tools.filter(t => t.category === 'developer').length },
  { id: 'image', name: 'Image & Media', icon: 'image', count: tools.filter(t => t.category === 'image').length },
  { id: 'pdf', name: 'PDF & Docs', icon: 'file-pdf', count: tools.filter(t => t.category === 'pdf').length },
  { id: 'seo', name: 'SEO & Marketing', icon: 'chart-line', count: tools.filter(t => t.category === 'seo').length },
  { id: 'calculator', name: 'Calculators', icon: 'calculator', count: tools.filter(t => t.category === 'calculator').length },
  { id: 'text', name: 'Text & Content', icon: 'font', count: tools.filter(t => t.category === 'text').length }
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

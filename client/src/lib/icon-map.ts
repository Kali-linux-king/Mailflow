import * as Icons from "lucide-react";

// Icon mapping for tools
export const iconMap: Record<string, React.ComponentType<any>> = {
  // Developer Tools
  FileJson: Icons.FileJson,
  Code2: Icons.Code2,
  Search: Icons.Search,
  RotateCcw: Icons.RotateCcw,
  Link: Icons.Link,
  Fingerprint: Icons.Fingerprint,
  Key: Icons.Key,
  FileText: Icons.FileText,
  Shield: Icons.Shield,
  Zap: Icons.Zap,

  // Image & Media Tools
  Archive: Icons.Archive,
  Scissors: Icons.Scissors,
  RefreshCw: Icons.RefreshCw,
  QrCode: Icons.QrCode,
  Globe: Icons.Globe,
  Palette: Icons.Palette,
  Crop: Icons.Crop,
  Minimize2: Icons.Minimize2,

  // PDF & Document Tools
  FilePlus: Icons.FilePlus,
  FileX: Icons.FileX,
  FileImage: Icons.FileImage,
  Calculator: Icons.Calculator,
  Type: Icons.Type,

  // SEO & Marketing Tools
  Tags: Icons.Tags,
  BarChart3: Icons.BarChart3,
  LinkIcon: Icons.Link,
  Share2: Icons.Share2,
  Bot: Icons.Bot,
  Code: Icons.Code,

  // Calculators & Converters
  Ruler: Icons.Ruler,
  DollarSign: Icons.DollarSign,
  Clock: Icons.Clock,
  Percent: Icons.Percent,
  Calendar: Icons.Calendar,
  Activity: Icons.Activity,

  // Text & Content Tools
  GitCompare: Icons.GitCompare,
  AlignLeft: Icons.AlignLeft,

  // Category Icons
  Grid3X3: Icons.Grid3X3,
  Image: Icons.Image,
  TrendingUp: Icons.TrendingUp,

  // Fallback
  Wrench: Icons.Wrench,
};

export function getIcon(iconName: string): React.ComponentType<any> {
  return iconMap[iconName] || iconMap.Wrench;
}
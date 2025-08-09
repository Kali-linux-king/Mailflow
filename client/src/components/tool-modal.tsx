import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

// Tool components
import { JsonFormatter } from "./tools/json-formatter";
import { PasswordGenerator } from "./tools/password-generator";
import { QrGenerator } from "./tools/qr-generator";
import { Base64Encoder } from "./tools/base64-encoder";
import { UrlEncoder } from "./tools/url-encoder";
import { HashGenerator } from "./tools/hash-generator";
import { LoremIpsum } from "./tools/lorem-ipsum";
import { CodeBeautifier } from "./tools/code-beautifier";
import { RegexTester } from "./tools/regex-tester";
import { ImageCompressor } from "./tools/image-compressor";
import { ColorPicker } from "./tools/color-picker";
import { TextCaseConverter } from "./tools/text-case-converter";
import { UnitConverter } from "./tools/unit-converter";
import { WordCounter } from "./tools/word-counter";
import { UrlShortener } from "./tools/url-shortener";
import { MetaGenerator } from "./tools/meta-generator";

// New tools
import { JWTDecoder } from "./tools/jwt-decoder";
import { ApiTester } from "./tools/api-tester";
import { ImageResizer } from "./tools/image-resizer";
import { SVGOptimizer } from "./tools/svg-optimizer";
import { PDFCompressor } from "./tools/pdf-compressor";
import { SchemaGenerator } from "./tools/schema-generator";
import { AgeCalculator } from "./tools/age-calculator";
import { TextDiffChecker } from "./tools/text-diff-checker";

interface ToolModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (toolId: string) => void;
}

export function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  if (!tool) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    } else {
      // Track tool usage when opening
      analytics.trackToolUsage(tool.id);
    }
  };

  const renderToolComponent = () => {
    switch (tool.id) {
      // Developer Tools
      case 'json-formatter':
        return <JsonFormatter />;
      case 'code-beautifier':
        return <CodeBeautifier />;
      case 'regex-tester':
        return <RegexTester />;
      case 'base64-encoder':
        return <Base64Encoder />;
      case 'url-encoder':
        return <UrlEncoder />;
      case 'hash-generator':
        return <HashGenerator />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'lorem-ipsum':
        return <LoremIpsum />;
      case 'jwt-decoder':
        return <JWTDecoder />;
      case 'api-tester':
        return <ApiTester />;
      
      // Image & Media Tools
      case 'image-compressor':
        return <ImageCompressor />;
      case 'qr-generator':
        return <QrGenerator />;
      case 'color-picker':
        return <ColorPicker />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'svg-optimizer':
        return <SVGOptimizer />;
      
      // PDF & Document Tools
      case 'word-counter':
        return <WordCounter />;
      case 'text-case-converter':
        return <TextCaseConverter />;
      case 'pdf-compressor':
        return <PDFCompressor />;
      
      // SEO & Marketing Tools
      case 'meta-generator':
        return <MetaGenerator />;
      case 'url-shortener':
        return <UrlShortener />;
      case 'schema-generator':
        return <SchemaGenerator />;
      
      // Calculators & Converters
      case 'unit-converter':
        return <UnitConverter />;
      case 'age-calculator':
        return <AgeCalculator />;
      
      // Text & Content Tools
      case 'text-diff-checker':
        return <TextDiffChecker />;
      default:
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold mb-2">Tool Interface Coming Soon</h3>
            <p className="text-slate-600 mb-6">We're working on bringing you this amazing tool. Check back soon!</p>
            <button 
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              data-testid="notify-button"
            >
              <i className="fas fa-bell mr-2"></i>Notify Me When Ready
            </button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" data-testid={`tool-modal-${tool.id}`}>
        <DialogHeader className="border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", tool.iconColor)}>
              {(() => {
                const { getIcon } = require("@/lib/icon-map");
                const IconComponent = getIcon(tool.icon);
                return <IconComponent className="w-6 h-6 text-white" />;
              })()}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-800">{tool.title}</DialogTitle>
              <p className="text-slate-600">{tool.description}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-6">
          {renderToolComponent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

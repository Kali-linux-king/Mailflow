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
import { CryptoPriceTracker } from "./tools/crypto-price-tracker";
import { CryptoConverter } from "./tools/crypto-converter";
import { WalletAddressValidator } from "./tools/wallet-address-validator";
import { CryptoPortfolioTracker } from "./tools/crypto-portfolio-tracker";
import { BlockchainExplorer } from "./tools/blockchain-explorer";
import { CryptoNewsAggregator } from "./tools/crypto-news-aggregator";

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
      case 'json-formatter':
        return <JsonFormatter />;
      case 'password-generator':
        return <PasswordGenerator />;
      case 'qr-generator':
        return <QrGenerator />;
      case 'base64-encoder':
        return <Base64Encoder />;
      case 'url-encoder':
        return <UrlEncoder />;
      case 'hash-generator':
        return <HashGenerator />;
      case 'lorem-ipsum':
        return <LoremIpsum />;
      case 'code-beautifier':
        return <CodeBeautifier />;
      case 'regex-tester':
        return <RegexTester />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'color-picker':
        return <ColorPicker />;
      case 'text-case-converter':
        return <TextCaseConverter />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'word-counter':
        return <WordCounter />;
      case 'url-shortener':
        return <UrlShortener />;
      case 'meta-generator':
        return <MetaGenerator />;
      case 'crypto-price-tracker':
        return <CryptoPriceTracker />;
      case 'crypto-converter':
        return <CryptoConverter />;
      case 'wallet-address-validator':
        return <WalletAddressValidator />;
      case 'crypto-portfolio-tracker':
        return <CryptoPortfolioTracker />;
      case 'blockchain-explorer':
        return <BlockchainExplorer />;
      case 'crypto-news-aggregator':
        return <CryptoNewsAggregator />;
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
              <i className={`fas fa-${tool.icon} text-xl`} />
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

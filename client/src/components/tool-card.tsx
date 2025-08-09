import { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (toolId: string) => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <div 
      className="tool-card-glow bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover-lift hover:shadow-2xl cursor-pointer sparkle-effect group slide-up"
      onClick={onClick}
      data-testid={`tool-card-${tool.id}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-all duration-300 float-animation", tool.iconColor)}>
          <i className={`fas fa-${tool.icon} text-xl`} />
        </div>
        <div className="flex flex-col space-y-1">
          {tool.popular && (
            <span className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm bounce-in neon-glow">
              ⭐ Popular
            </span>
          )}
          {tool.trending && (
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm bounce-in category-pulse">
              🔥 Trending
            </span>
          )}
          {tool.secure && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm bounce-in">
              🔒 Secure
            </span>
          )}
          {tool.aiPowered && (
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm bounce-in pulse-subtle">
              🤖 AI-Powered
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors text-glow">{tool.title}</h3>
      <p className="text-slate-600 text-sm mb-4 leading-relaxed">{tool.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-slate-500">
          <i className="fas fa-zap mr-1 text-yellow-500" />
          <span className="font-medium">Instant processing</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 rounded-full">
            Click to open →
          </span>
        </div>
      </div>
    </div>
  );
}

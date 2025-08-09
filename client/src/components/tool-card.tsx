import { Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all cursor-pointer"
      onClick={onClick}
      data-testid={`tool-card-${tool.id}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", tool.iconColor)}>
          <i className={`fas fa-${tool.icon} text-xl`} />
        </div>
        <div className="flex space-x-2">
          {tool.popular && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              Popular
            </span>
          )}
          {tool.trending && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              Trending
            </span>
          )}
          {tool.secure && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
              Secure
            </span>
          )}
          {tool.aiPowered && (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
              AI-Powered
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{tool.title}</h3>
      <p className="text-slate-600 text-sm mb-4">{tool.description}</p>
      
      <div className="flex items-center text-xs text-slate-500">
        <i className="fas fa-zap mr-1" />
        <span>Instant processing</span>
      </div>
    </div>
  );
}

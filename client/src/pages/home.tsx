import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool-card";
import { ToolModal } from "@/components/tool-modal";
import { tools, categories, getToolsByCategory, searchTools, type Tool, type ToolCategory } from "@/lib/tools";
import { analytics } from "@/lib/analytics";
import { Search, Bolt, BookmarkPlus, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTools = searchQuery 
    ? searchTools(searchQuery)
    : getToolsByCategory(activeCategory);

  const popularTools = analytics.getPopularTools();
  const categoryUsage = analytics.getCategoryUsage();
  const recentActivity = analytics.getRecentActivity();
  const usageStats = analytics.getUsageStats();

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const getToolNameById = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    return tool?.title || toolId;
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} mins ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hours ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-dt-accent rounded-lg flex items-center justify-center">
                  <Bolt className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-dt-secondary">DevToolkit</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="#tools" className="text-slate-600 hover:text-primary font-medium">Bolt</a>
                <a href="#categories" className="text-slate-600 hover:text-primary font-medium">Categories</a>
                <a href="#analytics" className="text-slate-600 hover:text-primary font-medium">Analytics</a>
              </nav>
              <Button className="bg-primary text-white hover:bg-blue-700" data-testid="bookmarks-button">
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Bookmarks
              </Button>
            </div>

            <Button variant="ghost" className="md:hidden" data-testid="mobile-menu">
              <Menu className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/50"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-dt-secondary mb-6 text-glow">
              36+ Free Online Tools for{' '}
              <span className="gradient-text bounce-in">Developers & Marketers</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Boost your productivity with our comprehensive collection of developer tools, SEO utilities, converters, and more. No registration required, privacy-focused, lightning-fast processing.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search 30+ tools... (e.g., JSON formatter, QR generator, hash calculator)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-12 pr-20 text-lg border-2 border-slate-200 rounded-2xl focus:border-primary shadow-lg"
                  data-testid="tool-search"
                />
                <Search className="absolute left-4 top-5 text-slate-400 w-5 h-5" />
                <Button 
                  className="absolute right-2 top-2 bg-primary text-white hover:bg-blue-700 rounded-xl"
                  data-testid="search-button"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center glass-effect rounded-2xl p-4 hover-lift">
              <div className="text-3xl font-bold text-primary pulse-subtle">36+</div>
              <div className="text-slate-700 font-medium">Free Tools</div>
            </div>
            <div className="text-center glass-effect rounded-2xl p-4 hover-lift">
              <div className="text-3xl font-bold text-purple-600 bounce-in">8</div>
              <div className="text-slate-700 font-medium">Categories</div>
            </div>
            <div className="text-center glass-effect rounded-2xl p-4 hover-lift">
              <div className="text-3xl font-bold text-green-600 neon-glow">0</div>
              <div className="text-slate-700 font-medium">Registration</div>
            </div>
            <div className="text-center glass-effect rounded-2xl p-4 hover-lift">
              <div className="text-3xl font-bold text-blue-600 category-pulse">100%</div>
              <div className="text-slate-700 font-medium">Privacy</div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section id="categories" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dt-secondary mb-4">Tool Categories</h2>
            <p className="text-lg text-slate-600">Organized by use case for maximum productivity</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center mb-8 bg-white rounded-2xl p-2 shadow-sm border border-slate-200">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className={cn(
                  "px-6 py-3 rounded-xl font-medium m-1",
                  activeCategory === category.id
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                onClick={() => setActiveCategory(category.id as ToolCategory | 'all')}
                data-testid={`category-${category.id}`}
              >
                <i className={`fas fa-${category.icon} mr-2`} />
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Bolt Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="tools-grid">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => handleToolClick(tool)}
              />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-slate-600">Try adjusting your search or browse different categories</p>
            </div>
          )}
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section id="analytics" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Usage Analytics & Popular Bolt</h2>
            <p className="text-lg text-slate-300">Real-time insights into tool usage and trends</p>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Most Used Bolt */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <i className="fas fa-fire text-orange-400 mr-3"></i>
                Most Popular Today
              </h3>
              <div className="space-y-4">
                {popularTools.slice(0, 5).map((item, index) => {
                  const tool = tools.find(t => t.id === item.toolId);
                  return (
                    <div key={item.toolId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm", tool?.iconColor || 'bg-blue-500')}>
                          <i className={`fas fa-${tool?.icon || 'tools'}`}></i>
                        </div>
                        <span>{getToolNameById(item.toolId)}</span>
                      </div>
                      <span className="text-orange-400 font-medium">{item.count} uses</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <i className="fas fa-chart-line text-blue-400 mr-3"></i>
                Usage Statistics
              </h3>
              <div className="space-y-6">
                {categoryUsage.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{item.category}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <i className="fas fa-clock text-green-400 mr-3"></i>
                Recent Activity
              </h3>
              <div className="space-y-3 text-sm">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-300">
                      {getToolNameById(activity.toolId)} - {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{usageStats.uptime}</div>
              <div className="text-slate-300 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{usageStats.avgResponse}</div>
              <div className="text-slate-300 text-sm">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{usageStats.availability}</div>
              <div className="text-slate-300 text-sm">Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">{usageStats.privacy}</div>
              <div className="text-slate-300 text-sm">Privacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dt-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-dt-accent rounded-lg flex items-center justify-center">
                  <Bolt className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-bold">DevToolkit</h3>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                Your ultimate collection of 30+ free online tools for developers, marketers, and creators. Fast, secure, and always free.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="bg-slate-700 hover:bg-slate-600 p-3">
                  <i className="fab fa-github text-xl"></i>
                </Button>
                <Button variant="ghost" size="sm" className="bg-slate-700 hover:bg-slate-600 p-3">
                  <i className="fab fa-twitter text-xl"></i>
                </Button>
                <Button variant="ghost" size="sm" className="bg-slate-700 hover:bg-slate-600 p-3">
                  <i className="fab fa-discord text-xl"></i>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Tool Categories</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white">Developer Bolt</a></li>
                <li><a href="#" className="hover:text-white">Image & Media</a></li>
                <li><a href="#" className="hover:text-white">PDF & Documents</a></li>
                <li><a href="#" className="hover:text-white">SEO & Marketing</a></li>
                <li><a href="#" className="hover:text-white">Calculators</a></li>
                <li><a href="#" className="hover:text-white">Text & Content</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white">API Documentation</a></li>
                <li><a href="#" className="hover:text-white">Usage Guide</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-300 mb-4 md:mb-0">
                © 2025 DevToolkit. All rights reserved. Built with ❤️ for developers worldwide.
              </p>
              <div className="flex items-center space-x-6 text-sm text-slate-300">
                <span className="flex items-center space-x-2">
                  <i className="fas fa-shield-alt text-green-400"></i>
                  <span>100% Privacy</span>
                </span>
                <span className="flex items-center space-x-2">
                  <i className="fas fa-zap text-yellow-400"></i>
                  <span>Client-side Processing</span>
                </span>
                <span className="flex items-center space-x-2">
                  <i className="fas fa-lock text-blue-400"></i>
                  <span>Secure & Free</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Tool Modal */}
      <ToolModal
        tool={selectedTool}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

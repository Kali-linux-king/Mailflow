import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool-card";
import { ToolModal } from "@/components/tool-modal";
import { tools, categories, getToolsByCategory, searchTools, type Tool, type ToolCategory } from "@/lib/tools";
import { analytics } from "@/lib/analytics";
import { Search, Bolt, BookmarkPlus, Menu, ChevronDown, ChevronUp, Star, TrendingUp, Clock, Shield, Zap, Lock, X, Loader2, Heart, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load heavy components
const LazyAnalyticsCharts = lazy(() => import('@/components/analytics-charts'));
const LazyNewsletterSignup = lazy(() => import('@/components/newsletter-signup'));

interface ToolModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (toolId: string) => void;
}

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  isBookmarked?: boolean;
  onBookmarkToggle?: (toolId: string) => void;
}

interface AnalyticsService {
  // ... existing methods
  getPopularTools(): { toolId: string; count: number }[];
  getCategoryUsage(): { category: string; percentage: number }[];
  getRecentActivity(): { toolId: string; timestamp: Date }[];
  getUsageStats(): {
    uptime: string;
    avgResponse: string;
    availability: string;
    privacy: string;
  };
  trackToolUsage(toolId: string): void;
  trackSearch(query: string): void; // Add this line
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('tool-view-mode', 'grid');
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<Tool[]>('recently-viewed', []);
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  // Track scroll position for scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized filtered tools with debounced search
  const filteredTools = useMemo(() => {
    setIsLoading(true);
    const result = debouncedSearchQuery 
      ? searchTools(debouncedSearchQuery)
      : getToolsByCategory(activeCategory);
    setTimeout(() => setIsLoading(false), 200);
    return result;
  }, [debouncedSearchQuery, activeCategory]);

  // Memoized analytics data with loading state
  const { popularTools, categoryUsage, recentActivity, usageStats } = useMemo(() => ({
    popularTools: analytics.getPopularTools(),
    categoryUsage: analytics.getCategoryUsage(),
    recentActivity: analytics.getRecentActivity(),
    usageStats: analytics.getUsageStats()
  }), []);

  // Enhanced tool click handler with recently viewed tracking
  const handleToolClick = useCallback((tool: Tool) => {
  setSelectedTool(tool);
  setIsModalOpen(true);
  analytics.trackToolUsage(tool.id);
    
    setRecentlyViewed((prev: Tool[]) => {
      const existingIndex = prev.findIndex((t: Tool) => t.id === tool.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated.splice(existingIndex, 1);
        return [tool, ...updated].slice(0, 5);
      }
      return [tool, ...prev].slice(0, 5);
    });
  }, [setRecentlyViewed]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTool(null);
  }, []);

  // Enhanced search with analytics
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.trackSearch(searchQuery);
    if (filteredTools.length === 0) {
      toast.info('No tools found matching your search. Try different keywords.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  // Clear search with animation
  const handleClearSearch = () => {
    setSearchQuery('');
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.focus();
  };

  // Format time ago with more precision
  const formatTimeAgo = useCallback((timestamp: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    
    return 'Just now';
  }, []);

  // Toggle category expansion with animation
  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev: Record<string, boolean>) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Toggle view mode with animation
  const toggleViewMode = () => {
  const newViewMode = viewMode === 'grid' ? 'list' : 'grid';
  setViewMode(newViewMode);
  toast.info(`Switched to ${newViewMode} view`, {
    position: 'bottom-right',
    autoClose: 2000,
  });
};

  // Scroll to section smoothly
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowMobileMenu(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => scrollToSection('hero')}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-dt-accent rounded-lg flex items-center justify-center">
                  <Bolt className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-dt-secondary">DevSuite</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                {['tools', 'categories', 'analytics', 'faq'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="text-slate-600 hover:text-primary font-medium transition-colors capitalize"
                  >
                    {item}
                  </button>
                ))}
              </nav>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="bg-primary text-white hover:bg-blue-700 transition-colors relative"
                      onClick={() => scrollToSection('bookmarks')}
                    >
                      <BookmarkPlus className="w-4 h-4 mr-2" />
                      Bookmarks
                      {bookmarks.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {bookmarks.length}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{bookmarks.length} bookmarked tools</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Button 
              variant="ghost" 
              className="md:hidden" 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-expanded={showMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-slate-600" />
              ) : (
                <Menu className="w-5 h-5 text-slate-600" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden bg-white/95 backdrop-blur-md py-4 px-2 shadow-lg rounded-lg mt-2 border border-slate-200 animate-in fade-in slide-in-from-top-2">
              <nav className="flex flex-col space-y-3">
                {['tools', 'categories', 'analytics', 'faq'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    className="text-slate-600 hover:text-primary font-medium px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors capitalize text-left"
                  >
                    {item}
                  </button>
                ))}
              </nav>
              <Button 
                className="w-full mt-4 bg-primary text-white hover:bg-blue-700 transition-colors"
                onClick={() => scrollToSection('bookmarks')}
              >
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Bookmarks ({bookmarks.length})
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg py-16 relative overflow-hidden" id="hero">
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-white/50"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:40px_40px] opacity-10"></div>
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dt-secondary mb-6 animate-fade-in">
                <span className="inline-block">36+ Free Online Tools for</span>{' '}
                <span className="gradient-text animate-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-dt-accent">
                  Developers & Marketers
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 animate-fade-in delay-100">
                Boost your productivity with our comprehensive collection of developer tools, SEO utilities, converters, and more. No registration required, privacy-focused, lightning-fast processing.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative animate-fade-in delay-200">
                <div className="relative">
                  <Input
                    id="search-input"
                    type="text"
                    placeholder="Search 30+ tools... (e.g., JSON formatter, QR generator, hash calculator)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-4 pl-12 pr-20 text-lg border-2 border-slate-200 rounded-2xl focus:border-primary shadow-lg transition-all hover:shadow-md"
                    aria-label="Search tools"
                  />
                  <Search className="absolute left-4 top-5 text-slate-400 w-5 h-5" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-16 top-4 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <Button 
                    type="submit"
                    className="absolute right-2 top-2 bg-primary text-white hover:bg-blue-700 rounded-xl transition-colors shadow-md"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in delay-300">
              {[
                { value: "36+", label: "Free Tools", color: "text-primary", icon: <Bolt className="w-5 h-5" /> },
                { value: "8", label: "Categories", color: "text-purple-600", icon: <Menu className="w-5 h-5" /> },
                { value: "0", label: "Registration", color: "text-green-600", icon: <Lock className="w-5 h-5" /> },
                { value: "100%", label: "Privacy", color: "text-blue-600", icon: <Shield className="w-5 h-5" /> }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center glass-effect rounded-2xl p-4 hover:shadow-lg transition-all duration-300 cursor-default group hover:-translate-y-1"
                  aria-label={`${stat.value} ${stat.label}`}
                >
                  <div className={`text-3xl font-bold ${stat.color} mb-2 flex justify-center`}>
                    {stat.icon}
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-1 group-hover:scale-105 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-slate-700 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recently Viewed Tools */}
      {recentlyViewed.length > 0 && (
        <section className="py-10 bg-slate-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dt-secondary flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Recently Viewed
              </h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setRecentlyViewed([])}
                className="text-slate-500 hover:text-slate-700"
              >
                Clear History
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {recentlyViewed.map((tool) => (
                <div 
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="bg-white rounded-lg p-3 shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      tool.iconColor || 'bg-blue-500'
                    )}>
                      <i className={`fas fa-${tool.icon} text-white`}></i>
                    </div>
                    <div className="truncate">
                      <h3 className="font-medium text-slate-800 group-hover:text-primary transition-colors truncate">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">{tool.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bookmarks Section */}
      {bookmarks.length > 0 && (
        <section id="bookmarks" className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-dt-secondary mb-6 flex items-center">
              <BookmarkPlus className="w-5 h-5 mr-2 text-primary" />
              Your Bookmarks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bookmarks.map(toolId => {
                const tool = tools.find(t => t.id === toolId);
                return tool ? (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onClick={() => handleToolClick(tool)}
                    isBookmarked={true}
                    onBookmarkToggle={toggleBookmark}
                  />
                ) : null;
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tool Categories Section */}
      <section id="categories" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dt-secondary mb-4">Tool Categories</h2>
            <p className="text-lg text-slate-600">Organized by use case for maximum productivity</p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-slate-500">
              Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
              {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.name}`}
              {searchQuery && ` for "${searchQuery}"`}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleViewMode}
              className="flex items-center space-x-2"
            >
              {viewMode === 'grid' ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  <span>List View</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <span>Grid View</span>
                </>
              )}
            </Button>
          </div>

          {/* Category Tabs - Desktop */}
          <div className="hidden md:flex flex-wrap justify-center mb-8 bg-white rounded-2xl p-2 shadow-sm border border-slate-200">
            <Button
              variant="ghost"
              className={cn(
                "px-6 py-3 rounded-xl font-medium m-1 transition-colors relative",
                activeCategory === 'all'
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "text-slate-600 hover:bg-slate-100"
              )}
              onClick={() => setActiveCategory('all')}
            >
              All Tools ({tools.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className={cn(
                  "px-6 py-3 rounded-xl font-medium m-1 transition-colors",
                  activeCategory === category.id
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                onClick={() => setActiveCategory(category.id as ToolCategory | 'all')}
              >
                <i className={`fas fa-${category.icon} mr-2`} />
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Category Tabs - Mobile */}
          <div className="md:hidden mb-8 space-y-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center px-4 py-3 text-left font-medium"
                onClick={() => toggleCategoryExpansion('all')}
                aria-expanded={expandedCategories['all']}
              >
                <span>All Tools ({tools.length})</span>
                {expandedCategories['all'] ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </Button>
              {expandedCategories['all'] && (
                <div className="px-4 pb-3 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    {tools.slice(0, 8).map(tool => (
                      <Button
                        key={tool.id}
                        variant="ghost"
                        className="justify-start text-sm h-8"
                        onClick={() => {
                          setActiveCategory('all');
                          setSearchQuery('');
                          handleToolClick(tool);
                        }}
                      >
                        {tool.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center px-4 py-3 text-left font-medium"
                  onClick={() => toggleCategoryExpansion(category.id)}
                  aria-expanded={expandedCategories[category.id]}
                >
                  <div className="flex items-center">
                    <i className={`fas fa-${category.icon} mr-3 text-slate-500`} />
                    <span>{category.name} ({category.count})</span>
                  </div>
                  {expandedCategories[category.id] ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </Button>
                {expandedCategories[category.id] && (
                  <div className="px-4 pb-3 pt-1">
                    <div className="grid grid-cols-2 gap-2">
                      {getToolsByCategory(category.id as ToolCategory).map(tool => (
                        <Button
                          key={tool.id}
                          variant="ghost"
                          className="justify-start text-sm h-8"
                          onClick={() => {
                            setActiveCategory(category.id as ToolCategory | 'all');
                            setSearchQuery('');
                            handleToolClick(tool);
                          }}
                        >
                          {tool.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tools Display */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onClick={() => handleToolClick(tool)}
                  isBookmarked={bookmarks.includes(tool.id)}
                  onBookmarkToggle={toggleBookmark}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTools.map((tool) => (
                <div 
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                      tool.iconColor || 'bg-blue-500'
                    )}>
                      <i className={`fas fa-${tool.icon} text-white text-lg`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-slate-800 group-hover:text-primary transition-colors">
                          {tool.title}
                        </h3>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(tool.id);
                          }}
                          className="text-slate-400 hover:text-primary transition-colors"
                        >
                          {bookmarks.includes(tool.id) ? (
                            <Heart className="w-5 h-5 fill-primary text-primary" />
                          ) : (
                            <Heart className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <p className="text-slate-600 mt-1">{tool.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {tool.tags?.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="outline"
                            className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border-slate-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredTools.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or browse different categories</p>
              <div className="flex justify-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  Reset Filters
                </Button>
                <Button 
                  variant="default"
                  onClick={() => scrollToSection('categories')}
                >
                  Browse Categories
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section id="analytics" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Usage Analytics & Popular Tools</h2>
            <p className="text-lg text-slate-300">Real-time insights into tool usage and trends</p>
          </div>

          {/* Lazy loaded charts */}
          <Suspense fallback={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-800 rounded-2xl p-6 h-80">
                  <Skeleton className="h-full w-full" />
                </div>
              ))}
            </div>
          }>
            <LazyAnalyticsCharts 
              popularTools={popularTools}
              categoryUsage={categoryUsage}
              recentActivity={recentActivity}
              onToolClick={handleToolClick}
            />
          </Suspense>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                value: usageStats.uptime, 
                label: "Uptime", 
                icon: <Shield className="w-6 h-6 text-green-400" />,
                tooltip: "Our service availability over the last 30 days"
              },
              { 
                value: usageStats.avgResponse, 
                label: "Avg Response", 
                icon: <Zap className="w-6 h-6 text-blue-400" />,
                tooltip: "Average response time for all tools"
              },
              { 
                value: usageStats.availability, 
                label: "Available", 
                icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
                tooltip: "Percentage of tools currently available"
              },
              { 
                value: usageStats.privacy, 
                label: "Privacy", 
                icon: <Lock className="w-6 h-6 text-orange-400" />,
                tooltip: "Client-side processing ensures your data never leaves your browser"
              }
            ].map((metric, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="bg-slate-800 rounded-2xl p-6 text-center hover-lift transition-transform cursor-default"
                    >
                      <div className="flex justify-center mb-3">
                        {metric.icon}
                      </div>
                      <div className="text-3xl font-bold mb-1">{metric.value}</div>
                      <div className="text-slate-300 text-sm">{metric.label}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-slate-700 text-slate-100 border-slate-600">
                    <p>{metric.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-primary to-dt-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={
            <div className="max-w-3xl mx-auto bg-white/10 rounded-2xl p-8 h-64">
              <Skeleton className="h-full w-full" />
            </div>
          }>
            <LazyNewsletterSignup />
          </Suspense>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dt-secondary mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Find answers to common questions about DevSuite</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "Is DevSuite really free to use?",
                answer: "Yes, all tools in DevSuite are completely free to use with no hidden costs. We believe in providing valuable tools without charging our users. Our platform is supported by optional donations and sponsored tools that are clearly marked.",
                icon: <Heart className="w-5 h-5 text-primary" />
              },
              {
                question: "Do I need to create an account?",
                answer: "No account or registration is required to use any of our tools. Everything works directly in your browser with no sign-up needed. Some tools offer the option to save your preferences locally in your browser if you choose to.",
                icon: <Lock className="w-5 h-5 text-blue-500" />
              },
              {
                question: "How do you ensure my data privacy?",
                answer: "All processing happens directly in your browser for most tools. We don't store or transmit your data to our servers unless explicitly required by the tool's functionality (like URL shortening). Each tool's privacy policy is clearly stated in its description.",
                icon: <Shield className="w-5 h-5 text-green-500" />
              },
              {
                question: "Can I suggest a new tool to add?",
                answer: "Absolutely! We welcome tool suggestions from our users. Please contact us through our support page with your idea, and if it aligns with our platform's goals and receives enough community interest, we'll prioritize its development.",
                icon: <Zap className="w-5 h-5 text-yellow-500" />
              },
              {
                question: "How often do you add new tools?",
                answer: "We continuously expand our collection based on user demand and emerging technologies. We typically release 2-3 new tools every month, with major updates quarterly. You can follow our changelog or newsletter to stay updated.",
                icon: <TrendingUp className="w-5 h-5 text-purple-500" />
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all hover:shadow-md"
              >
                <button 
                  className="w-full flex justify-between items-center p-4 text-left font-medium text-slate-700 hover:bg-slate-50 transition-colors group"
                  onClick={() => toggleCategoryExpansion(`faq-${index}`)}
                  aria-expanded={expandedCategories[`faq-${index}`]}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-primary">
                      {faq.icon}
                    </div>
                    <span className="group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  {expandedCategories[`faq-${index}`] ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                {expandedCategories[`faq-${index}`] && (
                  <div className="p-4 pt-0 text-slate-600 animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
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
                <h3 className="text-xl font-bold">DevSuite</h3>
              </div>
              <p className="text-slate-300 mb-6 max-w-md">
                Your ultimate collection of 30+ free online tools for developers, marketers, and creators. Fast, secure, and always free.
              </p>
              <div className="flex space-x-4">
                {['github', 'twitter', 'discord', 'linkedin'].map((social) => (
                  <TooltipProvider key={social}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="bg-slate-700 hover:bg-slate-600 p-3 transition-colors"
                          aria-label={`Follow us on ${social}`}
                        >
                          <i className={`fab fa-${social} text-xl`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-700 text-white border-slate-600">
                        <p>Follow us on {social.charAt(0).toUpperCase() + social.slice(1)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <Menu className="w-4 h-4 mr-2" />
                Tool Categories
              </h4>
              <ul className="space-y-2 text-slate-300">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <button 
                      onClick={() => {
                        setActiveCategory(category.id as ToolCategory | 'all');
                        scrollToSection('categories');
                      }}
                      className="hover:text-white transition-colors flex items-center"
                    >
                      <i className={`fas fa-${category.icon} mr-2 w-4 text-center`} />
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 flex items-center">
                <ExternalLink className="w-4 h-4 mr-2" />
                Resources
              </h4>
              <ul className="space-y-2 text-slate-300">
                {[
                  { name: "API Documentation", url: "#", icon: "code" },
                  { name: "Usage Guide", url: "#", icon: "book" },
                  { name: "Privacy Policy", url: "#", icon: "shield-alt" },
                  { name: "Terms of Service", url: "#", icon: "file-contract" },
                  { name: "Contact Support", url: "#", icon: "envelope" }
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href={item.url} 
                      className="hover:text-white transition-colors flex items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className={`fas fa-${item.icon} mr-2 w-4 text-center`} />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-300 mb-4 md:mb-0">
                © {new Date().getFullYear()} DevSuite. All rights reserved.
              </p>  
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-slate-300 mb-4 md:mb-0">
                {[
                  { icon: <Shield className="text-green-400 w-4 h-4" />, text: "100% Privacy" },
                  { icon: <Zap className="text-yellow-400 w-4 h-4" />, text: "Client-side Processing" },
                  { icon: <Lock className="text-blue-400 w-4 h-4" />, text: "Secure & Free" }
                ].map((item, index) => (
                  <span key={index} className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.text}</span>
                  </span>
                ))}
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm">Contact</a>
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
        isBookmarked={selectedTool ? bookmarks.includes(selectedTool.id) : false}
        onBookmarkToggle={toggleBookmark}
      />

      {/* Back to Top Button */}
      {showScrollIndicator && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors group"
          aria-label="Back to top"
        >
          <div className="absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-white text-primary rounded-full shadow-sm">
            ↑
          </div>
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Toast notifications */}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
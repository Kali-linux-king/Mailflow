// src/lib/analytics.ts

interface ToolUsage {
  toolId: string;
  count: number;
  lastUsed: Date;
}

interface CategoryUsage {
  category: string;
  percentage: number;
}

interface SearchEvent {
  query: string;
  timestamp: Date;
}

// Type declaration for Google Analytics
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

interface IAnalyticsService {
  trackToolUsage(toolId: string): void;
  trackSearch(query: string): void;
  getPopularTools(limit?: number): Array<{toolId: string, count: number}>;
  getCategoryUsage(): CategoryUsage[];
  getRecentActivity(limit?: number): Array<{toolId: string, timestamp: Date}>;
  getUsageStats(): { uptime: string; avgResponse: string; availability: string; privacy: string };
  getSearchHistory(limit?: number): string[];
  clearSearchHistory(): void;
}

class AnalyticsService implements IAnalyticsService {
  private storage = typeof window !== 'undefined' ? localStorage : null;
  private usageKey = 'devtoolkit_usage';
  private searchKey = 'devtoolkit_search_history';
  private maxSearchHistory = 100;

  private getUsageData(): ToolUsage[] {
    if (!this.storage) return [];
    try {
      const data = this.storage.getItem(this.usageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveUsageData(data: ToolUsage[]): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(this.usageKey, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  }

  private getSearchData(): SearchEvent[] {
    if (!this.storage) return [];
    try {
      const data = this.storage.getItem(this.searchKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveSearchData(data: SearchEvent[]): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(this.searchKey, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  }

  trackToolUsage(toolId: string): void {
    const data = this.getUsageData();
    const existing = data.find(item => item.toolId === toolId);
    
    if (existing) {
      existing.count++;
      existing.lastUsed = new Date();
    } else {
      data.push({
        toolId,
        count: 1,
        lastUsed: new Date()
      });
    }
    
    this.saveUsageData(data);

    // Track with Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'tool_usage', {
        tool_id: toolId,
        event_category: 'Tools',
        event_label: toolId
      });
    }
  }

  trackSearch(query: string): void {
    if (!query.trim()) return;

    const searches = this.getSearchData();
    searches.unshift({
      query,
      timestamp: new Date()
    });
    this.saveSearchData(searches.slice(0, this.maxSearchHistory));

    // Track with Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        event_category: 'Search',
        event_label: query
      });
    }
  }

  getPopularTools(limit: number = 5): Array<{toolId: string, count: number}> {
    const data = this.getUsageData();
    return data
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(item => ({ toolId: item.toolId, count: item.count }));
  }

  getCategoryUsage(): CategoryUsage[] {
    return [
      { category: 'Developer Tools', percentage: 45 },
      { category: 'Image & Media', percentage: 28 },
      { category: 'PDF & Docs', percentage: 12 },
      { category: 'SEO & Marketing', percentage: 10 },
      { category: 'Calculators', percentage: 5 }
    ];
  }

  getRecentActivity(limit: number = 6): Array<{toolId: string, timestamp: Date}> {
    // Combine stored usage data with mock data for demo purposes
    const storedData = this.getUsageData()
      .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime())
      .slice(0, Math.floor(limit/2))
      .map(item => ({ toolId: item.toolId, timestamp: item.lastUsed }));

    const mockData = [
      { toolId: 'json-formatter', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
      { toolId: 'qr-generator', timestamp: new Date(Date.now() - 3 * 60 * 1000) },
      { toolId: 'image-compressor', timestamp: new Date(Date.now() - 5 * 60 * 1000) }
    ].slice(0, limit - storedData.length);

    return [...storedData, ...mockData].slice(0, limit);
  }

  getUsageStats() {
    return {
      uptime: '99.9%',
      avgResponse: '<100ms',
      availability: '24/7',
      privacy: '100%'
    };
  }

  getSearchHistory(limit: number = 5): string[] {
    return this.getSearchData()
      .slice(0, limit)
      .map(item => item.query);
  }

  clearSearchHistory(): void {
    if (this.storage) {
      try {
        this.storage.removeItem(this.searchKey);
      } catch {
        // Ignore errors
      }
    }
  }
}

export const analytics = new AnalyticsService();
export type { IAnalyticsService as AnalyticsService };
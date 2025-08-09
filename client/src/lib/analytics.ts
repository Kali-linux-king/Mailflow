interface ToolUsage {
  toolId: string;
  count: number;
  lastUsed: Date;
}

interface CategoryUsage {
  category: string;
  percentage: number;
}

class AnalyticsService {
  private storage = typeof window !== 'undefined' ? localStorage : null;
  private usageKey = 'devtoolkit_usage';

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
  }

  getPopularTools(limit: number = 5): Array<{toolId: string, count: number}> {
    const data = this.getUsageData();
    return data
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(item => ({ toolId: item.toolId, count: item.count }));
  }

  getCategoryUsage(): CategoryUsage[] {
    // Mock data for demonstration
    return [
      { category: 'Developer Tools', percentage: 45 },
      { category: 'Image & Media', percentage: 28 },
      { category: 'PDF & Docs', percentage: 12 },
      { category: 'SEO & Marketing', percentage: 10 },
      { category: 'Calculators', percentage: 5 }
    ];
  }

  getRecentActivity(limit: number = 6): Array<{toolId: string, timestamp: Date}> {
    // Mock recent activity for demonstration
    const mockActivity = [
      { toolId: 'json-formatter', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
      { toolId: 'qr-generator', timestamp: new Date(Date.now() - 3 * 60 * 1000) },
      { toolId: 'image-compressor', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
      { toolId: 'password-generator', timestamp: new Date(Date.now() - 7 * 60 * 1000) },
      { toolId: 'url-shortener', timestamp: new Date(Date.now() - 12 * 60 * 1000) },
      { toolId: 'hash-generator', timestamp: new Date(Date.now() - 15 * 60 * 1000) }
    ];
    
    return mockActivity.slice(0, limit);
  }

  getUsageStats() {
    return {
      uptime: '99.9%',
      avgResponse: '<100ms',
      availability: '24/7',
      privacy: '100%'
    };
  }
}

export const analytics = new AnalyticsService();

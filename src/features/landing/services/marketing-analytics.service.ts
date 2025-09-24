// Marketing Analytics Service for Landing Page Optimization
export interface MarketingEvent {
  event: string;
  section: string;
  timestamp: string;
  userId?: string;
  sessionId: string;
  page: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  referrer?: string;
  userAgent?: string;
  extra?: Record<string, any>;
}

export interface ConversionFunnel {
  step: 'view' | 'engage' | 'signup' | 'trial' | 'convert';
  source: string;
  timestamp: string;
  value?: number;
}

export interface LandingPageMetrics {
  totalViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  bounceRate: number;
  averageSessionTime: number;
  ctaClickRate: number;
  signupRate: number;
  trialStartRate: number;
  paidConversionRate: number;
  revenuePerVisitor: number;
}

class MarketingAnalyticsService {
  private sessionId: string;
  private userId?: string;
  private source?: string;
  private medium?: string;
  private campaign?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTrackingParams();
    this.setupPageViewTracking();
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTrackingParams(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    this.source = urlParams.get('utm_source') || document.referrer || 'direct';
    this.medium = urlParams.get('utm_medium') || 'organic';
    this.campaign = urlParams.get('utm_campaign') || undefined;
  }

  private setupPageViewTracking(): void {
    if (typeof window === 'undefined') return;

    // Track initial page view
    this.trackPageView();

    // Track scroll depth
    this.trackScrollDepth();

    // Track time on page
    this.trackTimeOnPage();
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public async trackPageView(): Promise<void> {
    await this.track('page_view', 'landing', {
      path: window.location.pathname,
      title: document.title,
    });
  }

  public async trackCTAClick(section: string, ctaText?: string): Promise<void> {
    await this.track('cta_click', section, {
      cta_text: ctaText,
      conversion_potential: this.calculateConversionPotential(section),
    });

    // Track in Google Analytics if available
    if ((window as any).gtag) {
      (window as any).gtag('event', 'cta_click', {
        event_category: 'Landing',
        event_label: section,
        value: this.getEventValue(section),
      });
    }
  }

  public async trackSignup(plan?: string, source?: string): Promise<void> {
    await this.track('signup', 'conversion', {
      plan,
      source: source || this.source,
      funnel_step: 'signup_complete',
    });
  }

  public async trackTrialStart(plan: string): Promise<void> {
    await this.track('trial_start', 'conversion', {
      plan,
      funnel_step: 'trial_start',
      trial_length: '14_days',
    });
  }

  public async trackPurchase(plan: string, amount: number, currency: string = 'EUR'): Promise<void> {
    await this.track('purchase', 'conversion', {
      plan,
      amount,
      currency,
      funnel_step: 'purchase_complete',
      revenue: amount,
    });

    // Track in Google Analytics if available
    if ((window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: `txn_${Date.now()}`,
        value: amount,
        currency,
        items: [{
          item_id: plan,
          item_name: `MyFitHero ${plan}`,
          category: 'Subscription',
          quantity: 1,
          price: amount,
        }],
      });
    }
  }

  public async trackVideoPlay(section: string, videoUrl: string): Promise<void> {
    await this.track('video_play', section, {
      video_url: videoUrl,
      engagement_type: 'video',
    });
  }

  public async trackFormStart(formType: string): Promise<void> {
    await this.track('form_start', formType, {
      engagement_type: 'form',
    });
  }

  public async trackFormComplete(formType: string): Promise<void> {
    await this.track('form_complete', formType, {
      engagement_type: 'form',
      conversion_step: 'form_complete',
    });
  }

  private async trackScrollDepth(): Promise<void> {
    const scrollThresholds = [25, 50, 75, 90, 100];
    const trackedDepths = new Set<number>();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedDepths.has(threshold)) {
          trackedDepths.add(threshold);
          this.track('scroll_depth', 'engagement', {
            scroll_depth: threshold,
            engagement_type: 'scroll',
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  private async trackTimeOnPage(): Promise<void> {
    const startTime = Date.now();
    const timeThresholds = [10, 30, 60, 120, 300]; // seconds
    const trackedTimes = new Set<number>();

    const interval = setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);

      timeThresholds.forEach(threshold => {
        if (timeOnPage >= threshold && !trackedTimes.has(threshold)) {
          trackedTimes.add(threshold);
          this.track('time_on_page', 'engagement', {
            time_threshold: threshold,
            engagement_type: 'time',
          });
        }
      });

      // Stop tracking after 10 minutes
      if (timeOnPage > 600) {
        clearInterval(interval);
      }
    }, 5000);

    // Clean up on page unload
    window.addEventListener('beforeunload', () => clearInterval(interval));
  }

  private calculateConversionPotential(section: string): number {
    const sectionWeights: Record<string, number> = {
      'hero': 10,
      'features': 7,
      'pricing': 9,
      'testimonials': 6,
      'final-cta': 10,
      'demo-request': 8,
    };
    return sectionWeights[section] || 5;
  }

  private getEventValue(section: string): number {
    const sectionValues: Record<string, number> = {
      'hero': 100,
      'pricing': 150,
      'final-cta': 200,
      'demo-request': 120,
    };
    return sectionValues[section] || 50;
  }

  private async track(event: string, section: string, extra: Record<string, any> = {}): Promise<void> {
    const eventData: MarketingEvent = {
      event,
      section,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      page: 'landing',
      source: this.source,
      medium: this.medium,
      campaign: this.campaign,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      extra,
    };

    try {
      // Send to your analytics backend
      await fetch('/api/analytics/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      // Log for development
    } catch (error) {
      console.warn('Failed to track marketing event:', error);
      // Store in localStorage as fallback
      this.storeEventLocally(eventData);
    }
  }

  private storeEventLocally(event: MarketingEvent): void {
    try {
      const stored = localStorage.getItem('myfithero_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('myfithero_analytics', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store event locally:', error);
    }
  }

  public async getStoredEvents(): Promise<MarketingEvent[]> {
    try {
      const stored = localStorage.getItem('myfithero_analytics') || '[]';
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to get stored events:', error);
      return [];
    }
  }

  public async getLandingMetrics(): Promise<LandingPageMetrics> {
    try {
      const response = await fetch('/api/analytics/landing-metrics');
      return await response.json();
    } catch (error) {
      console.warn('Failed to get landing metrics:', error);
      // Return mock data for development
      return {
        totalViews: 15420,
        uniqueVisitors: 12890,
        conversionRate: 3.2,
        bounceRate: 42.1,
        averageSessionTime: 165,
        ctaClickRate: 8.7,
        signupRate: 3.2,
        trialStartRate: 2.8,
        paidConversionRate: 1.4,
        revenuePerVisitor: 2.84,
      };
    }
  }
}

// Singleton instance
export const marketingAnalytics = new MarketingAnalyticsService();

export default marketingAnalytics;
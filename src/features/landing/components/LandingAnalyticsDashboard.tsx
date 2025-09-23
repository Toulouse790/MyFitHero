// Landing Page Analytics Dashboard Component
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MousePointer, 
  DollarSign, 
  Eye,
  Timer,
  Target,
  Zap,
} from 'lucide-react';
import { marketingAnalytics, LandingPageMetrics } from '../services/marketing-analytics.service';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'percentage' | 'currency' | 'time';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend,
  format = 'number'
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `${val.toFixed(2)}€`;
      case 'time':
        return `${Math.round(val)}s`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendIcon = () => {
    if (!change) return null;
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="text-gray-400">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-xs ${getTrendColor()} mt-1`}>
            {getTrendIcon()}
            <span className="ml-1">
              {change > 0 ? '+' : ''}{change.toFixed(1)}% {changeLabel || 'vs mois dernier'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface LandingAnalyticsDashboardProps {
  className?: string;
}

export const LandingAnalyticsDashboard: React.FC<LandingAnalyticsDashboardProps> = ({
  className = ''
}) => {
  const [metrics, setMetrics] = useState<LandingPageMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await marketingAnalytics.getLandingMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
    
    // Refresh metrics every 5 minutes
    const interval = setInterval(loadMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500">
          {error || 'Aucune donnée disponible'}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Landing Page
          </h2>
          <p className="text-gray-600">
            Performance en temps réel de votre page d'accueil
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Live
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Visiteurs totaux"
          value={metrics.totalViews}
          change={12.5}
          icon={<Eye className="w-4 h-4" />}
          trend="up"
        />
        
        <MetricCard
          title="Visiteurs uniques"
          value={metrics.uniqueVisitors}
          change={8.2}
          icon={<Users className="w-4 h-4" />}
          trend="up"
        />
        
        <MetricCard
          title="Taux de conversion"
          value={metrics.conversionRate}
          change={-2.1}
          icon={<Target className="w-4 h-4" />}
          trend="down"
          format="percentage"
        />
        
        <MetricCard
          title="Taux de rebond"
          value={metrics.bounceRate}
          change={-5.8}
          icon={<Zap className="w-4 h-4" />}
          trend="up"
          format="percentage"
        />
        
        <MetricCard
          title="Temps moyen"
          value={metrics.averageSessionTime}
          change={15.3}
          icon={<Timer className="w-4 h-4" />}
          trend="up"
          format="time"
        />
        
        <MetricCard
          title="Clics CTA"
          value={metrics.ctaClickRate}
          change={23.7}
          icon={<MousePointer className="w-4 h-4" />}
          trend="up"
          format="percentage"
        />
        
        <MetricCard
          title="Inscriptions"
          value={metrics.signupRate}
          change={18.9}
          icon={<Users className="w-4 h-4" />}
          trend="up"
          format="percentage"
        />
        
        <MetricCard
          title="Revenus / visiteur"
          value={metrics.revenuePerVisitor}
          change={7.4}
          icon={<DollarSign className="w-4 h-4" />}
          trend="up"
          format="currency"
        />
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Tunnel de conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { step: 'Visiteurs', count: metrics.totalViews, percentage: 100 },
              { step: 'Engagés (scroll >50%)', count: Math.round(metrics.totalViews * 0.6), percentage: 60 },
              { step: 'Clics CTA', count: Math.round(metrics.totalViews * metrics.ctaClickRate / 100), percentage: metrics.ctaClickRate },
              { step: 'Inscriptions', count: Math.round(metrics.totalViews * metrics.signupRate / 100), percentage: metrics.signupRate },
              { step: 'Essais démarrés', count: Math.round(metrics.totalViews * metrics.trialStartRate / 100), percentage: metrics.trialStartRate },
              { step: 'Conversions payantes', count: Math.round(metrics.totalViews * metrics.paidConversionRate / 100), percentage: metrics.paidConversionRate },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium">{item.step}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{item.count.toLocaleString()}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-12 text-right text-sm text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingAnalyticsDashboard;
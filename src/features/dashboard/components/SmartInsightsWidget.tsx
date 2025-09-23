import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Trophy, 
  Calendar,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SmartInsight } from '../types';

interface SmartInsightsWidgetProps {
  insights: SmartInsight[];
  onInsightAction: (insight: SmartInsight) => void;
  onDismissInsight: (insightId: string) => void;
}

const SmartInsightsWidget: React.FC<SmartInsightsWidgetProps> = ({ 
  insights, 
  onInsightAction, 
  onDismissInsight 
}) => {
  const getInsightIcon = (type: SmartInsight['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-5 h-5" />;
      case 'recommendation':
        return <Brain className="w-5 h-5" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'prediction':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: SmartInsight['type'], priority: SmartInsight['priority']) => {
    if (priority === 'high') return 'from-red-500 to-pink-500';
    if (type === 'achievement') return 'from-yellow-500 to-orange-500';
    if (type === 'recommendation') return 'from-blue-500 to-purple-500';
    if (type === 'alert') return 'from-orange-500 to-red-500';
    return 'from-green-500 to-emerald-500';
  };

  const getPriorityBadge = (priority: SmartInsight['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Urgent</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Important</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Info</Badge>;
    }
  };

  if (insights.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Insights IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun insight disponible pour le moment</p>
            <p className="text-sm">L'IA analyse vos données...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Insights IA
            <Badge variant="secondary" className="text-xs">
              {insights.length} nouveau{insights.length > 1 ? 'x' : ''}
            </Badge>
          </div>
          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.slice(0, 3).map((insight) => (
          <div
            key={insight.id}
            className="relative group p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type, insight.priority)} text-white flex-shrink-0`}>
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {insight.title}
                  </h4>
                  {getPriorityBadge(insight.priority)}
                </div>
                
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  {insight.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {new Date(insight.timestamp).toLocaleDateString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {insight.actionText && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onInsightAction(insight)}
                        className="text-xs h-7 px-3"
                      >
                        {insight.actionText}
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDismissInsight(insight.id)}
                      className="text-xs h-7 px-2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {insights.length > 3 && (
          <Button 
            variant="outline" 
            className="w-full mt-4 text-sm"
            onClick={() => {/* Navigate to insights page */}}
          >
            Voir tous les insights ({insights.length})
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartInsightsWidget;
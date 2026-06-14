import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ 
  value, 
  label, 
  icon: Icon,
  trend,
  trendLabel,
  trendType = 'positive',
  className = '' 
}) => {
  const trendColors = {
    positive: 'text-positive',
    neutral: 'text-ink-muted',
    negative: 'text-destructive'
  };

  return (
    <div className={`bg-surface-raised rounded-xl border border-line p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl font-bold text-ink">{value}</div>
        {Icon && (
          <div className="text-ink-subtle">
            <Icon size={24} />
          </div>
        )}
      </div>

      <div className="text-ink-muted text-base mb-4">{label}</div>
      
      {(trend || trendLabel) && (
        <div className={`flex items-center gap-2 text-sm ${trendColors[trendType]}`}>
          {trend && <TrendingUp size={16} />}
          <span>{trend || trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
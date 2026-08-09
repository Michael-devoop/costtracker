import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className,
  hover = true,
  padding = 'md',
}: CardProps) {
  const paddingClass = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding];

  return (
    <div
      className={cn(
        hover ? 'glass-card' : 'glass-card-static',
        paddingClass,
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Card Sub-components ──────────────────────────────────────

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>
        <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
        {subtitle && (
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardMetricProps {
  label: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  icon?: React.ReactNode;
  className?: string;
}

export function CardMetric({ label, value, trend, icon, className }: CardMetricProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
        <span className="metric-label">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="metric-value">{value}</span>
        {trend && (
          <span
            className={cn(
              'text-xs font-semibold',
              trend.positive ? 'text-emerald-400' : 'text-red-400'
            )}
          >
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}

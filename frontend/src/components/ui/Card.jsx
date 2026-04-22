import { cn } from '../../utils/cn';

export function Card({ className, ...props }) {
  return <div className={cn('clay-panel p-5', className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('mb-4 space-y-1', className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-bold text-white', className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-muted', className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn('space-y-4', className)} {...props} />;
}

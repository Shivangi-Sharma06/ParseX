import { cn } from '../../utils/cn';

export function Badge({ className, tone = 'default', ...props }) {
  const toneClass = {
    default: 'border-line bg-white/5 text-white',
    success: 'border-success/40 bg-success/10 text-success',
    danger: 'border-danger/40 bg-danger/10 text-danger',
    info: 'border-info/40 bg-info/10 text-info',
    accent: 'border-accentStart/40 bg-accentStart/15 text-purple-200',
  }[tone];

  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', toneClass, className)}
      {...props}
    />
  );
}

import { cn } from '../../utils/cn';

export function Badge({ className, tone = 'default', ...props }) {
  const toneClass = {
    default: 'border-line bg-white/5 text-body',
    success: 'border-success/45 bg-success/15 text-success',
    danger: 'border-danger/45 bg-danger/15 text-danger',
    info: 'border-info/45 bg-info/15 text-info',
    accent: 'border-primary/40 bg-primary/15 text-[#ffb6c4]',
  }[tone];

  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', toneClass, className)}
      {...props}
    />
  );
}

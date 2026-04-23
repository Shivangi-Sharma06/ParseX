import { cn } from '../../utils/cn';

export function Badge({ className, tone = 'default', ...props }) {
  const toneClass = {
    default: 'border-line bg-[#fff0c214] text-[#ffe7ba]',
    success: 'border-success/45 bg-success/15 text-success',
    danger: 'border-danger/45 bg-danger/15 text-danger',
    info: 'border-info/45 bg-info/15 text-info',
    accent: 'border-accentStart/40 bg-accentStart/15 text-[#ffe295]',
  }[tone];

  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', toneClass, className)}
      {...props}
    />
  );
}

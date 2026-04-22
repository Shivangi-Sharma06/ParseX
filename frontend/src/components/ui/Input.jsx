import { cn } from '../../utils/cn';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'focus-ring h-11 w-full rounded-xl border border-line bg-base/80 px-3 text-sm text-white placeholder:text-muted',
        className,
      )}
      {...props}
    />
  );
}

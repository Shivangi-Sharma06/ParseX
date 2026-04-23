import { cn } from '../../utils/cn';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'focus-ring h-11 w-full rounded-xl2 border border-[#f0dfbc40] bg-[#18130d] px-3 text-sm text-white placeholder:text-[#d9c39a]',
        className,
      )}
      {...props}
    />
  );
}

import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl2 border text-sm font-medium uppercase tracking-[0.06em] transition-all duration-200 ease-out hover:scale-[1.02] active:scale-[0.99] focus-ring disabled:pointer-events-none disabled:opacity-60 disabled:hover:scale-100',
  {
    variants: {
      variant: {
        default: 'border-line bg-surface px-4 py-2 text-ink hover:bg-white/[0.06] hover:shadow-clay-sm',
        gradient: 'border-lineStrong bg-ink px-4 py-2 text-base hover:opacity-90 hover:shadow-glow-primary',
        ghost: 'border-line bg-transparent px-4 py-2 text-body hover:bg-white/5',
        danger: 'border-danger/50 bg-danger/15 px-4 py-2 text-danger hover:bg-danger/25',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? 'span' : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };

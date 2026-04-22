import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl2 border text-sm font-semibold transition-all duration-200 focus-ring disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'border-line bg-surface px-4 py-2 text-white hover:shadow-clay-sm',
        gradient:
          'border-transparent bg-gradient-to-r from-accentStart to-accentEnd px-4 py-2 text-white hover:shadow-glow',
        ghost: 'border-line bg-transparent px-4 py-2 text-white hover:bg-white/5',
        danger: 'border-danger/50 bg-danger/20 px-4 py-2 text-danger hover:bg-danger/30',
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

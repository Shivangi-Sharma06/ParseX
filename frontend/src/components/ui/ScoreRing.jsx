import { cn } from '../../utils/cn';

const sizeClassMap = {
  sm: 'h-[72px] w-[72px]',
  md: 'h-[90px] w-[90px]',
  lg: 'h-[120px] w-[120px]',
};

export function ScoreRing({ score = 0, size = 'md' }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className={cn('relative', sizeClassMap[size] || sizeClassMap.md)}>
      <svg viewBox="0 0 90 90" className="h-full w-full">
        <circle cx="45" cy="45" r={radius} className="fill-none stroke-white/10" strokeWidth="8" />
        <circle
          cx="45"
          cy="45"
          r={radius}
          className="fill-none stroke-accentStart"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 45 45)"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-sm font-semibold">{score}%</div>
    </div>
  );
}

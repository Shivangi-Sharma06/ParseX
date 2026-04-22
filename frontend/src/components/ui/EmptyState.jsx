import { FileSearch } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({ title, description, cta, onClick }) {
  return (
    <div className="clay-panel flex flex-col items-center justify-center gap-3 p-8 text-center">
      <FileSearch className="h-10 w-10 text-muted" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="max-w-md text-sm text-muted">{description}</p>
      {cta ? (
        <Button variant="gradient" onClick={onClick}>
          {cta}
        </Button>
      ) : null}
    </div>
  );
}

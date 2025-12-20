import { Loader2Icon, LucideProps } from 'lucide-react';

import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: LucideProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin text-green-500', className)}
      {...props}
    />
  );
}

export { Spinner };

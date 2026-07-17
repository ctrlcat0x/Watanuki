import { cn } from '@/utils/cn';
import { Loader2Icon } from '@watanuki/ui/icons';

export function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

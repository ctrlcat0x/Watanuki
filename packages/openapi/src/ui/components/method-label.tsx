import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type MethodColor = 'green' | 'yellow' | 'red' | 'blue' | 'orange';

const colorClasses: Record<MethodColor, string> = {
  green: 'text-green-600 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
  red: 'text-red-600 dark:text-red-400',
  blue: 'text-blue-600 dark:text-blue-400',
  orange: 'text-orange-600 dark:text-orange-400',
};

export function badgeVariants({ color }: { color?: MethodColor | null } = {}) {
  return cn('font-mono font-medium', color && colorClasses[color]);
}

function getMethodColor(method: string): MethodColor {
  switch (method.toUpperCase()) {
    case 'PUT':
      return 'yellow';
    case 'PATCH':
      return 'orange';
    case 'POST':
      return 'blue';
    case 'DELETE':
      return 'red';
    default:
      return 'green';
  }
}

export function Badge({
  className,
  color,
  ...props
}: Omit<HTMLAttributes<HTMLSpanElement>, 'color'> & { color?: MethodColor | null }) {
  return (
    <span className={cn(badgeVariants({ color }), className)} {...props}>
      {props.children}
    </span>
  );
}

export function MethodLabel({
  children,
  ...props
}: Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  children: string;
}) {
  return (
    <Badge {...props} color={getMethodColor(children)}>
      {children.toUpperCase()}
    </Badge>
  );
}

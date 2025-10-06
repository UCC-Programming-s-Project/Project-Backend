import { BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Logo = ({ className, ...props }: React.ComponentProps<'svg'>) => {
  return <BookMarked className={cn('h-8 w-8', className)} {...props} />;
};

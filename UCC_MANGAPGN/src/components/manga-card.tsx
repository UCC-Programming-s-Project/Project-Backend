import Image from 'next/image';
import Link from 'next/link';
import type { Manga } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface MangaCardProps {
  manga: Manga;
  className?: string;
}

export function MangaCard({ manga, className }: MangaCardProps) {
  const author = manga.authors?.[0]?.name;

  return (
    <Link href={`/catalog/${manga.mal_id}`} className="block group">
      <Card className={cn("overflow-hidden h-full transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1", className)}>
        <CardContent className="p-0">
          <div className="aspect-[2/3] relative">
            <Image
              src={manga.images.jpg.large_image_url || manga.images.jpg.image_url}
              alt={`Cover of ${manga.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              data-ai-hint="manga cover"
            />
            {manga.score && (
                 <div className="absolute top-2 right-2 flex items-center bg-background/80 backdrop-blur-sm text-foreground p-1 rounded-md text-xs font-bold">
                    <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                    <span>{manga.score.toFixed(2)}</span>
                </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{manga.title_english || manga.title}</h3>
            {author && <p className="text-xs text-muted-foreground truncate">{author}</p>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

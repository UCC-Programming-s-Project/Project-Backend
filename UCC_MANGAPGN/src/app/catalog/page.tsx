'use client';
import { useState, useEffect } from 'react';
import { MangaCard } from '@/components/manga-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Manga } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getManga(page = 1) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/manga?page=${page}&limit=24&order_by=popularity`);
    if (!response.ok) {
      console.error('Failed to fetch manga');
      return { data: [], pagination: {} };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching manga:', error);
    return { data: [], pagination: {} };
  }
}

async function getGenres() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/genres/manga');
        if (!response.ok) {
            console.error('Failed to fetch genres');
            return [];
        }
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
}


export default function CatalogPage() {
  const [mangaList, setMangaList] = useState<Manga[]>([]);
  const [genres, setGenres] = useState<{ mal_id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getManga(page).then((result) => {
      setMangaList(prev => page === 1 ? result.data : [...prev, ...result.data]);
      setHasNextPage(result.pagination?.has_next_page || false);
      setIsLoading(false);
    });
  }, [page]);

  useEffect(() => {
    getGenres().then(setGenres);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Manga Catalog</h1>
        <p className="text-lg text-muted-foreground mt-2">Find your next favorite series.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-card rounded-lg border shadow-sm">
        <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search for a manga..." className="pl-10" />
        </div>
        <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.mal_id} value={String(genre.mal_id)}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by Popularity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Sort by Popularity</SelectItem>
                <SelectItem value="favorites">Sort by Favorites</SelectItem>
                <SelectItem value="rank">Sort by Rank</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {isLoading && page === 1 && Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        ))}
        {mangaList.map((manga) => (
          <MangaCard key={manga.mal_id} manga={manga} />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Button onClick={() => setPage(p => p - 1)} variant="outline" className="mr-2" disabled={page <= 1 || isLoading}>Previous</Button>
        <Button onClick={() => setPage(p => p + 1)} disabled={!hasNextPage || isLoading}>
            {isLoading && page > 1 ? 'Loading...' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

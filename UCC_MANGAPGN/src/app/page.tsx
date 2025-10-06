'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { MangaCard } from '@/components/manga-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Manga } from '@/lib/types';

async function getTopManga() {
  try {
    const response = await fetch('https://api.jikan.moe/v4/top/manga?limit=10');
    if (!response.ok) {
      console.error('Failed to fetch top manga');
      return [];
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching top manga:', error);
    return [];
  }
}

export default function Home() {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [newReleases, setNewReleases] = useState<Manga[]>([]);

  useEffect(() => {
    getTopManga().then(setPopularManga);
    // Using top manga for new releases as well for now
    getTopManga().then(manga => setNewReleases(manga.slice().reverse())); 
  }, []);

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl tracking-tight drop-shadow-lg">
            Welcome to MangaVerse
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md font-body">
            Your universe of manga stories awaits. Dive into epic adventures, heartwarming tales, and thrilling mysteries.
          </p>
          <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 group">
            <Link href="/catalog">
              Explore Catalog
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">Popular This Week</h2>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {popularManga.map((manga) => (
                <CarouselItem key={manga.mal_id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                  <MangaCard manga={manga} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12 hidden sm:flex" />
            <CarouselNext className="mr-12 hidden sm:flex" />
          </Carousel>
        </div>
      </section>
      
      <section className="py-12 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">New Releases</h2>
           <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {newReleases.map((manga) => (
                <CarouselItem key={manga.mal_id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                  <MangaCard manga={manga} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12 hidden sm:flex" />
            <CarouselNext className="mr-12 hidden sm:flex" />
          </Carousel>
        </div>
      </section>

    </div>
  );
}

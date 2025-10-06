'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, MessageCircle, BookOpen, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { reviewsData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import type { Manga } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getMangaById(id: string) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/manga/${id}`);
        if (!response.ok) {
            return null;
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Failed to fetch manga by id", error);
        return null;
    }
}


export default function MangaDetailPage({ params }: { params: { id: string } }) {
  const [manga, setManga] = useState<Manga | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Fetch reviews from an API
  const reviews = reviewsData.filter((r) => r.mangaId === params.id);

  useEffect(() => {
    if (params.id) {
        setIsLoading(true);
        getMangaById(params.id).then(mangaData => {
            setManga(mangaData);
            setIsLoading(false);
        });
    }
  }, [params.id]);


  if (isLoading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                <div className="md:col-span-1">
                    <Skeleton className="w-full h-[600px] rounded-lg" />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                     <Skeleton className="h-24 w-full" />
                     <div className="flex gap-4">
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-12 w-32" />
                     </div>
                </div>
            </div>
        </div>
    )
  }

  if (!manga) {
    notFound();
  }
  
  const author = manga.authors?.[0]?.name;
  const allGenres = [...manga.genres, ...manga.themes, ...manga.demographics];


  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-1">
          <Card className="overflow-hidden sticky top-24">
            <Image
              src={manga.images.jpg.large_image_url || manga.images.jpg.image_url}
              alt={`Cover of ${manga.title}`}
              width={400}
              height={600}
              className="w-full h-auto"
              priority
            />
          </Card>
        </div>

        <div className="md:col-span-2">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">{manga.title_english || manga.title}</h1>
          {author && <p className="text-xl text-muted-foreground mt-2">{author}</p>}

          <div className="flex items-center flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
             {manga.score && (
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{manga.score.toFixed(2)} ({manga.scored_by?.toLocaleString()} votes)</span>
                </div>
             )}
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{reviews.length} reviews</span>
            </div>
            {manga.chapters && <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{manga.chapters} Chapters</span>
            </div>}
            {manga.published.from && <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(manga.published.from).getFullYear()}</span>
            </div>}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {allGenres.map((genre) => (
              <Badge key={genre.mal_id} variant="secondary">{genre.name}</Badge>
            ))}
          </div>

          <p className="mt-6 text-base leading-relaxed">{manga.synopsis}</p>

          <div className="flex gap-4 mt-8">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">Buy Now</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline">Reserve In Store</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className='font-headline text-2xl'>Reserve '{manga.title}'</DialogTitle>
                  <DialogDescription>
                    Fill in your details below to reserve this manga for in-store pickup. We'll notify you when it's ready.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                   {/* TODO: Backend team to implement form submission logic with Firestore */}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input id="name" placeholder="Your Name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit">Confirm Reservation</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Separator className="my-10" />

          <div>
            <h2 className="font-headline text-3xl font-bold mb-6">Reviews & Ratings</h2>
            <div className="space-y-6 mb-8">
              {reviews.map((review) => (
                <div key={review.id} className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={review.avatar} alt={review.user} />
                    <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{review.user}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="mt-2 text-sm">{review.comment}</p>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                    {/* TODO: Backend team to implement review submission */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Your Rating:</span>
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Button key={i} variant="ghost" size="icon" className="h-7 w-7">
                                    <Star className="w-5 h-5 text-gray-300 hover:text-yellow-400" />
                                </Button>
                            ))}
                        </div>
                    </div>
                  <Textarea placeholder={`Share your thoughts on ${manga.title}...`} />
                  <Button>Submit Review</Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

import { MangaRecommendation } from '@/components/manga-recommendation';

export default function RecommendPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Manga Recommendation</h1>
        <p className="text-lg text-muted-foreground mt-2">Discover your next obsession with our AI-powered tool.</p>
      </div>

      <MangaRecommendation />
    </div>
  );
}

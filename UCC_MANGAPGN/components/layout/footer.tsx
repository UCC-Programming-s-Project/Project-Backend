import { Github, Twitter, Instagram } from 'lucide-react';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Logo className="h-7 w-7 text-primary" />
            <span className="font-bold font-headline text-xl">MangaVerse</span>
          </div>
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
            <Link href="/recommend" className="hover:text-primary transition-colors">Recommend</Link>
            <Link href="/forum" className="hover:text-primary transition-colors">Forum</Link>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="GitHub">
                    <Github className="h-5 w-5" />
                </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                </a>
            </Button>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-4">
          <p>&copy; {new Date().getFullYear()} MangaVerse. All Rights Reserved.</p>
          <p className="mt-1">A project for a team programming course.</p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Wand2 } from 'lucide-react';
import { suggestManga } from '@/ai/flows/suggest-manga';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  readingHistory: z.string().min(10, {
    message: 'Please tell us about at least one manga you have read.',
  }),
  preferences: z.string().min(10, {
    message: 'Please describe your preferences a little more.',
  }),
});

type SuggestionResult = {
  suggestions: string[];
  reasoning: string;
};

export function MangaRecommendation() {
  const [result, setResult] = useState<SuggestionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      readingHistory: '',
      preferences: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const suggestion = await suggestManga(data);
      setResult(suggestion);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to get recommendations. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Wand2 className="text-accent" />
                AI Recommendation Engine
              </CardTitle>
              <CardDescription>
                Let our AI suggest your next read. The more detail you provide, the better the recommendations!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="readingHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Reading History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I've read all of Berserk and loved the dark fantasy themes. I also enjoyed the humor in One-Punch Man.'"
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I prefer series with complex characters and a fast-paced plot. I'm not a big fan of romance. I love detailed art styles.'"
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Get Recommendations'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Here are your recommendations!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <h3 className="font-bold text-lg mb-2">Suggested Titles:</h3>
                <ul className="list-disc pl-5 space-y-1">
                    {result.suggestions.map((title) => (
                        <li key={title}>{title}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-2">Why you might like them:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{result.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

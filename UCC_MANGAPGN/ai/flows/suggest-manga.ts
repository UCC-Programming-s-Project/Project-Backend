'use server';

/**
 * @fileOverview A manga recommendation AI agent.
 *
 * - suggestManga - A function that handles the manga suggestion process.
 * - SuggestMangaInput - The input type for the suggestManga function.
 * - SuggestMangaOutput - The return type for the suggestManga function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMangaInputSchema = z.object({
  readingHistory: z
    .string()
    .describe(
      'A detailed list of manga titles the user has read, including genres, preferred themes, and any specific preferences.'
    ),
  preferences: z
    .string()
    .describe(
      'A description of the user’s general preferences, such as favorite authors, art styles, or narrative elements.'
    ),
});
export type SuggestMangaInput = z.infer<typeof SuggestMangaInputSchema>;

const SuggestMangaOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggested manga titles based on the user input.'),
  reasoning: z
    .string()
    .describe(
      'An explanation of why each manga title was suggested, based on the user’s reading history and preferences.'
    ),
});
export type SuggestMangaOutput = z.infer<typeof SuggestMangaOutputSchema>;

export async function suggestManga(input: SuggestMangaInput): Promise<SuggestMangaOutput> {
  return suggestMangaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMangaPrompt',
  input: {schema: SuggestMangaInputSchema},
  output: {schema: SuggestMangaOutputSchema},
  prompt: `You are an expert manga recommender. A user will provide their reading history and their preferences and you will use that to suggest manga.

Reading History: {{{readingHistory}}}
Preferences: {{{preferences}}}

Based on the user's history and preferences, suggest some manga titles they might enjoy and explain why:

{{#each suggestions}}
- {{this}} (Reason: {{../reasoning}})
{{/each}}`,
});

const suggestMangaFlow = ai.defineFlow(
  {
    name: 'suggestMangaFlow',
    inputSchema: SuggestMangaInputSchema,
    outputSchema: SuggestMangaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

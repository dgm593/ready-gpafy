'use server';
/**
 * @fileOverview GPAfy AI Advisor flow using Genkit and Gemini.
 * 
 * - predictiveGpaAdvisor - A function that calculates required GPA or predicts future CGPA.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FutureSemesterSchema = z.object({
  expectedCreditHours: z.number().int().min(1).describe('Expected credit hours for this future semester.'),
  expectedGpa: z.number().min(0).max(4).describe('Expected GPA for this future semester (0.00 - 4.00).'),
});

const PredictiveGpaAdvisorInputSchema = z.object({
  currentCgpa: z.number().min(0).max(4).describe('Current cumulative GPA.'),
  currentTotalCreditHours: z.number().int().min(0).describe('Total credit hours accumulated so far.'),
  targetCgpa: z.number().min(0).max(4).optional().describe('Desired cumulative GPA.'),
  nextSemesterCreditHours: z.number().int().min(1).optional().describe('Expected credit hours for the next semester.'),
  futureSemesters: z.array(FutureSemesterSchema).optional().describe('Array of expected future semesters.'),
});

export type PredictiveGpaAdvisorInput = z.infer<typeof PredictiveGpaAdvisorInputSchema>;

const PredictiveGpaAdvisorOutputSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('requiredGpaCalculation'),
    requiredGpaForNextSemester: z.number(),
    nextSemesterCreditHours: z.number().int(),
    targetCgpa: z.number(),
    message: z.string().describe('A motivational or strategic message from the advisor.'),
  }),
  z.object({
    type: z.literal('cgpaPrediction'),
    predictedCgpa: z.number(),
    message: z.string().describe('A predictive message about the future academic standing.'),
  }),
  z.object({
    type: z.literal('error'),
    message: z.string(),
  }),
]);

export type PredictiveGpaAdvisorOutput = z.infer<typeof PredictiveGpaAdvisorOutputSchema>;

export async function predictiveGpaAdvisor(input: PredictiveGpaAdvisorInput): Promise<PredictiveGpaAdvisorOutput> {
  try {
    return await predictiveGpaAdvisorFlow(input);
  } catch (error) {
    console.error('Advisor Action Error:', error);
    return { type: 'error', message: 'The AI Advisor encountered an issue. Please try again later.' };
  }
}

const advisorPrompt = ai.definePrompt({
  name: 'predictiveGpaAdvisorPrompt',
  input: { schema: PredictiveGpaAdvisorInputSchema },
  output: { schema: PredictiveGpaAdvisorOutputSchema },
  prompt: `You are GPAfy, a minimalist and expert academic advisor. Your goal is to provide precise calculations and high-level strategy to students.

Current Standing:
- CGPA: {{{currentCgpa}}}
- Total Earned Credits: {{{currentTotalCreditHours}}}

Task:
{{#if targetCgpa}}
Calculate the GPA required in the next {{{nextSemesterCreditHours}}} credits to reach a target CGPA of {{{targetCgpa}}}. 
If it is mathematically impossible (requires > 4.0), set the requiredGpaForNextSemester to the actual calculated value even if it is high, but provide a message explaining why it's difficult.
{{else}}
Predict the future CGPA after these semesters: {{#each futureSemesters}}- {{{expectedCreditHours}}} credits at {{{expectedGpa}}} GPA {{/each}}
{{/if}}

Style:
- Be concise, professional, and slightly motivational.
- Focus on actionable strategy.`,
});

const predictiveGpaAdvisorFlow = ai.defineFlow(
  {
    name: 'predictiveGpaAdvisorFlow',
    inputSchema: PredictiveGpaAdvisorInputSchema,
    outputSchema: PredictiveGpaAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await advisorPrompt(input);
    if (!output) {
      return { type: 'error', message: 'The advisor could not generate a response.' };
    }
    return output;
  }
);

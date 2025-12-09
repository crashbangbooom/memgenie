import { IGqlContext } from '@/types';
import { log } from 'console';
import OpenAI from 'openai';

export const user = (_: unknown, args: unknown, { user }: IGqlContext) => {
  return user;
};

export const solveQuestion = async (
  _: unknown,
  {
    question,
    options,
    context,
  }: {
    question: string;
    options: string[];
    context: string;
  }
) => {
  const optionsString = options
    .map((option, index) => {
      return index + ': ' + option;
    })
    .join('\n');
  let prompt =
    'You are a question solver. Solve following question and return the number of correct option. If there is a main word also return that word. For example, in the following question\nWhat is the meaning of malice\nMalice is the main word' +
    `JSON format:
{
  "correctOption": <number>
  "mainWord": "<main word>"
}` +
    '\nExample of output {correctOption: 1}\n<question>\n';
  prompt += question;
  prompt +=
    '\n</question>below are the options\n<options>\n' +
    optionsString +
    '\n</options>';

  console.log('Prompt sent to OpenAI:', prompt);

  if (context) {
    prompt +=
      'Here is the context for this question\n<context>\n' +
      context +
      '\n</context>';
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content as string);
};

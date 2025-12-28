import prisma from '@/prisma/prisma';
import { IGqlContext } from '@/types';
import OpenAI from 'openai';

const promptResponseMap = new Map<string, string>();

export const user = (_: unknown, args: unknown, { user }: IGqlContext) => {
  if (!user) {
    return null;
  }
  user.isSubscribed =
    !!user.subscriptionEndDate &&
    new Date(user.subscriptionEndDate) > new Date();
  return user;
};

export const users = async (_: unknown, args: unknown) => {
  return prisma.user.findMany();
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
    `\n\nJSON format:
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

  if (promptResponseMap.has(prompt)) {
    console.log('Prompt found in cache');
    const cachedResponse = promptResponseMap.get(prompt)!;
    return JSON.parse(cachedResponse);
  } else {
    console.log('Prompt not found in cache');
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

  console.log(
    'RESPONSE:\n',
    response.choices[0].message.content,
    '\nEND RESPONSE\n\n\n'
  );
  promptResponseMap.set(prompt, response.choices[0].message.content as string);
  return JSON.parse(response.choices[0].message.content as string);
};

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
  },
  { user }: IGqlContext
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

  if (question.indexOf('Q_WITH_HINT: ') === 0) {
    prompt =
      'You have to find the missing word or guess the word. The word should be returned as mainWord.\n\n';
    prompt +=
      'You will be provided with a hint, word length and in some cases some content where the missing word should exist.\n\n';
    prompt +=
      'Based on the hint and other information, you have to guess the missing word.\n\n';
    prompt +=
      'The response should be in JSON format as below:\n{\n  "mainWord": "<the guessed word>"\n}\n\n';
    const questionWithoutPrefix = question.replace('Q_WITH_HINT: ', '');
    prompt += 'Here is the information you have:\n\n' + questionWithoutPrefix;
    prompt += 'Context is: ' + context + '\n\n';
  }

  if (promptResponseMap.has(prompt)) {
    console.log('Prompt found in cache');
    const cachedResponse = promptResponseMap.get(prompt)!;
    const response = JSON.parse(cachedResponse);
    console.log('Cached response:', response);
    return {
      ...response,
      userId: user?.id || 'guest',
      isSubscribed: user
        ? user.subscriptionEndDate &&
          new Date(user.subscriptionEndDate) > new Date()
        : false,
    };
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

  promptResponseMap.set(prompt, response.choices[0].message.content as string);
  const openaiResponse = JSON.parse(
    response.choices[0].message.content as string
  );
  console.log('OpenAI response:', openaiResponse);
  return {
    ...openaiResponse,
    userId: user?.id || 'guest',
    isSubscribed: user
      ? user.subscriptionEndDate &&
        new Date(user.subscriptionEndDate) > new Date()
      : false,
  };
};

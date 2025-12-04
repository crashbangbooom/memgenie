import { IGqlContext } from '@/types';
import { log } from 'console';

export const user = (_: unknown, args: unknown, { user }: IGqlContext) => {
  return user;
};

export const solveQuestion = (
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
    'You are a question solver. Solve following question and return the number of correct option\nExample of output {correctOption: 1}\n<question>\n';
  prompt += question;
  prompt +=
    '\n</question>below are the options\n<options>\n' +
    optionsString +
    '\n</options>';

  if (context) {
    prompt +=
      'Here is the context for this question\n<context>\n' +
      context +
      '\n</context>';
  }
  console.log(prompt);
  return {
    correctOption: 1,
  };
};

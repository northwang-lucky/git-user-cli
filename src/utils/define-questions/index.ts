import { Question } from 'inquirer';
import { BaseQuestion, QuestionList } from './types';

export function defineQuestions<
  Questions extends Record<string, BaseQuestion<Question>>,
  Answers extends Record<keyof Questions, any>
>(questions: Questions): QuestionList<Questions, Answers> {
  return Object.entries(questions).map(([key, value]) => ({
    name: key,
    ...value,
  }));
}

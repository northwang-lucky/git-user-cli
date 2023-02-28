import { AsyncDynamicQuestionProperty, Question } from 'inquirer';

export type Booleanish = 'Yes' | 'No';

export type QuestionList<
  Questions extends Record<string, Question<Answers>>,
  Answers extends Record<keyof Questions, any>
> = Question<Answers>[];

export type BaseQuestion<Q extends Question> = Omit<Omit<Q, 'name'>, 'when'>;

type Process<T extends Record<string, [Question, any]>, Q extends Question> = Omit<Omit<Q, 'name'>, 'when'> & {
  when?: AsyncDynamicQuestionProperty<boolean, ExtractAnswers<T>> | undefined;
};

export type ExtractQuestions<T extends Record<string, [Question, any]>> = {
  [K in keyof T]: Process<T, T[K][0]>;
};

export type ExtractAnswers<T extends Record<string, [Question, any]>> = {
  [K in keyof T]: T[K][1];
};

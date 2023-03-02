import { ListQuestion } from 'inquirer';
import { ExtractAnswers, ExtractQuestions } from '../define-questions/types';

export type GetUserOptions = {
  global?: boolean;
};

export type SetUserOptions = {
  global?: boolean;
};

export type PrintUserInfoOptions = {
  global?: boolean;
  showSuccess?: boolean;
};

export namespace GetTargetUser {
  export type Options = {
    name?: string;
    email?: string;
    index?: string;
  };

  type QuestionsAndAnswers = {
    userIndex: [ListQuestion, string];
  };

  export type Questions = ExtractQuestions<QuestionsAndAnswers>;

  export type Answers = ExtractAnswers<QuestionsAndAnswers>;
}

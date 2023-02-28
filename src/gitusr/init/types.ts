import { InputQuestion, ListQuestion } from 'inquirer';
import { Booleanish } from '../../utils';
import { ExtractAnswers, ExtractQuestions } from '../../utils/define-questions/types';

export namespace Init {
  export type Options = {
    force?: boolean;
  };

  type QuestionsAndAnswers = {
    overrideConfirm: [ListQuestion, Booleanish];
    userName: [InputQuestion, string | undefined];
    userEmail: [InputQuestion, string | undefined];
  };

  export type Questions = ExtractQuestions<QuestionsAndAnswers>;

  export type Answers = ExtractAnswers<QuestionsAndAnswers>;
}

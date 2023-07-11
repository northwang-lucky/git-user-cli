import { ListQuestion } from 'inquirer';
import { Booleanish, ExtractAnswers, ExtractQuestions } from '../../utils/define-questions/types';

export namespace Replace {
  export type Options = {
    withName?: string;
    withEmail?: string;
    withIndex?: string;
  };

  type QuestionsAndAnswers = {
    runUseCommand: [ListQuestion, Booleanish];
  };

  export type Questions = ExtractQuestions<QuestionsAndAnswers>;

  export type Answers = ExtractAnswers<QuestionsAndAnswers>;
}

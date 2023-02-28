import { InputQuestion } from 'inquirer';
import { ExtractAnswers, ExtractQuestions } from '../../utils/define-questions/types';

export namespace Add {
  type QuestionsAndAnswers = {
    userName: [InputQuestion, string];
    userEmail: [InputQuestion, string];
  };

  export type Questions = ExtractQuestions<QuestionsAndAnswers>;

  export type Answers = ExtractAnswers<QuestionsAndAnswers>;
}

import { InputQuestion } from 'inquirer';
import { ExtractAnswers, ExtractQuestions } from '../utils';

export namespace GitClone {
  type QuestionsAndAnswers = {
    userIndex: [InputQuestion, string];
  };

  export type Questions = ExtractQuestions<QuestionsAndAnswers>;

  export type Answers = ExtractAnswers<QuestionsAndAnswers>;
}

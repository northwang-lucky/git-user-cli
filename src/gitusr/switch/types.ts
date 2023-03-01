import { ListQuestion } from 'inquirer';
import { ExtractAnswers, ExtractQuestions } from '../../utils';

export namespace Switch {
  export type Options = {
    global?: boolean;
    name?: string;
    email?: string;
    index?: string;
  };

  type QuestionsAndAnswers = {
    userIndex: [ListQuestion, number];
  };

  export type Questions = ExtractQuestions<QuestionsAndAnswers>;

  export type Answers = ExtractAnswers<QuestionsAndAnswers>;
}

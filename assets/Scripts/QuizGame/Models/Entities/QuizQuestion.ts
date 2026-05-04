import { QuizAnswer } from './QuizAnswer';

export interface QuizQuestion {
    statement: string;

    answers: [QuizAnswer, QuizAnswer, QuizAnswer];
}
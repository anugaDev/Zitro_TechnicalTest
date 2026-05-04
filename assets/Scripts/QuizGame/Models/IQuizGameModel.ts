import { QuizQuestion } from './Entities/QuizQuestion';

export interface IQuizGameModel
{
    setQuestionsConfiguration(questions: QuizQuestion[]): void;

    getCurrentQuestion(): QuizQuestion;

    submitAnswer(answerIndex: number): boolean;

    nextQuestion(): boolean;

    getScore(): number;

    getTotalQuestions(): number;

    reset(): void;
}
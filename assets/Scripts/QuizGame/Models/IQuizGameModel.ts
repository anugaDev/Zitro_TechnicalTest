import { QuizQuestion } from './Entities/QuizQuestion';

export interface IQuizGameModel
{
    setQuestionsConfiguration(questions: QuizQuestion[]): void;

    getCurrentQuestion(): QuizQuestion;

    getCurrentAnswers(): string[];

    getCorrectAnswerText(): string;

    submitAnswer(answerIndex: number): boolean;

    nextQuestion(): boolean;

    getScore(): number;

    getTotalQuestions(): number;

    reset(): void;
}
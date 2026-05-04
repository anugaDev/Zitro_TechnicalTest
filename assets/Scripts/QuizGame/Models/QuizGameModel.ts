import { QuizQuestion } from './Entities/QuizQuestion';
import { IQuizGameModel } from './IQuizGameModel';
import { QuizAnswer } from "db://assets/Scripts/QuizGame/Models/Entities/QuizAnswer";

export class QuizGameModel implements IQuizGameModel {
    private _questions: QuizQuestion[] = [];

    private _currentIndex: number = 0;

    private _score: number = 0;

    setQuestionsConfiguration(questions: QuizQuestion[]): void {
        this._questions = questions;
        this.reset();
    }

    getCurrentQuestion(): QuizQuestion {
        return this._questions[this._currentIndex];
    }

    public getScore(): number {
        return this._score;
    }

    public getTotalQuestions(): number {
        return this._questions.length;
    }

    nextQuestion(): boolean {
        this._currentIndex++;
        return this._currentIndex < this._questions.length;
    }

    submitAnswer(answerIndex: number): boolean {

        const isCorrect = this._questions[this._currentIndex].answers[answerIndex].isCorrect;
        this.SetCurrentScore(isCorrect);
        return isCorrect;
    }

    private SetCurrentScore(isCorrect: boolean): void {
        if (!isCorrect) {
            return;
        }

        this._score++;
    }

    public reset(): void {
        this.resetStatements();
        this._currentIndex = 0;
        this._score = 0;
    }

    private resetStatements(): void {
        const shuffledQuestions = (this.shuffleStatements([...this._questions]) as QuizQuestion[]).map(question => ({
            statement: question.statement,
            answers: this.shuffleStatements([...question.answers]) as [QuizAnswer, QuizAnswer, QuizAnswer]
        }));

        this._questions = shuffledQuestions;
    }

    private shuffleStatements(elements: (QuizQuestion | QuizAnswer)[]): (QuizQuestion | QuizAnswer)[] {
        for (let lastIndex = elements.length - 1; lastIndex > 0; lastIndex--) {
            const swapIndex = Math.floor(Math.random() * (lastIndex + 1));
            [elements[lastIndex], elements[swapIndex]] = [elements[swapIndex], elements[lastIndex]];
        }
        return elements;
    }
}
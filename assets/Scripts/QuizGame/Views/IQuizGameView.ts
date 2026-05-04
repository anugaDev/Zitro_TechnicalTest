export interface IQuizGameView
{
    onAnswerSelected: ((index: number) => void) | null;

    onNextPressed: (() => void) | null;

    onPlayAgainPressed: (() => void) | null;

    showQuestion(statement: string, answers: string[]): void;

    showFeedback(wasCorrect: boolean, correctText: string): void;

    showResults(score: number, total: number): void;

    showQuestionPanel(): void;

    hideAllPanels(): void;

    onSceneFadeInCompleted(): void;

    unbindAll(): void;
}

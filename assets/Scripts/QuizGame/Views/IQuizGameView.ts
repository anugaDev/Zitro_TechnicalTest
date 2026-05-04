export interface IQuizGameView
{
    onAnswerSelected: ((index: number) => void) | null;

    onNextPressed: (() => void) | null;

    onPlayAgainPressed: (() => void) | null;

    onFeedbackFadeOutCompleted: (() => void) | null;

    onStatementFadeCompleted: (() => void) | null;

    onResultsFadeInCompleted: (() => void) | null;

    onResultsFadeOutCompleted: (() => void) | null;

    showQuestion(statement: string, answers: string[]): void;

    showFeedback(wasCorrect: boolean, correctText: string): void;

    showResults(score: number, total: number): void;

    showQuestionPanel(): void;

    hideAllPanels(): void;

    onSceneFadeInCompleted(): void;

    playFeedbackFadeOut(): void;

    playStatementFade(): void;

    playResultsFadeIn(): void;

    playResultsFadeOut(): void;

    setAnswerButtonsInteractable(value: boolean): void;

    setNextButtonInteractable(value: boolean): void;

    setPlayAgainInteractable(value: boolean): void;

    unbindAll(): void;
}

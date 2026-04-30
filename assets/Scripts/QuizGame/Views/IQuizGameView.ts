export interface IQuizGameView {

    // ── Events (set by controller at init, cleared at dispose) ────────
    onAnswerSelected:   ((index: number) => void) | null;
    onNextPressed:      (() => void) | null;
    onPlayAgainPressed: (() => void) | null;

    // ── Display methods ───────────────────────────────────────────────

    /** Renders the statement and rebuilds the answer buttons. */
    showQuestion(statement: string, answers: string[]): void;

    /** Shows the feedback panel with the result of the last answer. */
    showFeedback(wasCorrect: boolean, correctText: string): void;

    /** Shows the results panel with the final score. */
    showResults(score: number, total: number): void;

    /** Hides feedback and results panels, revealing the question panel. */
    showQuestionPanel(): void;

    /** Unregisters all button listeners and clears event properties. */
    unbindAll(): void;
}

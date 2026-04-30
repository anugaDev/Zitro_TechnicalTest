import { _decorator, Component, Button, RichText, Node, Prefab, instantiate } from 'cc';
import { IQuizGameView } from './IQuizGameView';

const { ccclass, property } = _decorator;

@ccclass('QuizGameView')
export class QuizGameView extends Component implements IQuizGameView {

    @property(RichText)
    public StatementText: RichText = null!;

    @property(Node)
    public AnswerLayout: Node = null!;

    @property(Prefab)
    public AnswerButtonPrefab: Prefab = null!;

    @property(Button)
    public ExitButton: Button = null!;

    @property(Node)
    public FeedbackPanel: Node = null!;

    @property(RichText)
    public FeedbackText: RichText = null!;

    @property(Button)
    public NextButton: Button = null!;

    @property(Node)
    public ResultsPanel: Node = null!;

    @property(RichText)
    public ResultsText: RichText = null!;

    @property(Button)
    public PlayAgainButton: Button = null!;

    @property(Button)
    public ResultsExitButton: Button = null!;

    public onAnswerSelected: ((index: number) => void) | null = null;

    public onPlayAgainPressed: (() => void) | null = null;

    public onNextPressed: (() => void) | null = null;

    public onExitPressed: (() => void) | null = null;

    protected onLoad(): void {
        this.ExitButton.node.on(
            Button.EventType.CLICK, this.handleExitClick, this
        );
        this.NextButton.node.on(
            Button.EventType.CLICK, this.handleNextClick, this
        );
        this.PlayAgainButton.node.on(
            Button.EventType.CLICK, this.handlePlayAgainClick, this
        );
        this.ResultsExitButton.node.on(
            Button.EventType.CLICK, this.handleExitClick, this
        );
    }

    protected onDestroy(): void {
        this.unbindAll();
    }

    public showQuestion(statement: string, answers: string[]): void {
        this.StatementText.string = statement;
        this.AnswerLayout.removeAllChildren();
        this.setQuestions(answers);
    }

    private setQuestions(answers: string[]) : void {
        answers.forEach((text, index) => {
            const node = instantiate(this.AnswerButtonPrefab);
            const lbl  = node.getComponentInChildren(RichText)!;
            lbl.string = text;
            node.getComponent(Button)!.node.on(
                Button.EventType.CLICK,
                () => this.onAnswerSelected?.(index),
                this
            );
            this.AnswerLayout.addChild(node);
        });
    }

    public showFeedback(wasCorrect: boolean, correctText: string): void {
        this.FeedbackPanel.active = true;
        this.FeedbackText.string = wasCorrect
            ? '<color=#44ff44><b>✓ Correct!</b></color>'
            : `<color=#ff4444><b>✗ Wrong!</b></color>\n` +
              `<color=#ffffff>Correct answer: ${correctText}</color>`;
    }

    public showResults(score: number, total: number): void {
        this.ResultsPanel.active = true;
        this.ResultsText.string =
            `<color=#ffffff><b>Quiz Finished!</b></color>\n` +
            `<color=#ffdd44>Score: ${score} / ${total}</color>`;
    }

    public showQuestionPanel(): void {
        this.FeedbackPanel.active = false;
        this.ResultsPanel.active  = false;
    }

    public unbindAll(): void {
        this.ExitButton?.node.off(Button.EventType.CLICK, this.handleExitClick, this);
        this.NextButton?.node.off(Button.EventType.CLICK, this.handleNextClick, this);
        this.PlayAgainButton?.node.off(Button.EventType.CLICK, this.handlePlayAgainClick, this);
        this.ResultsExitButton?.node.off(Button.EventType.CLICK, this.handleExitClick, this);
        this.AnswerLayout?.removeAllChildren();

        this.onPlayAgainPressed = null;
        this.onAnswerSelected = null;
        this.onNextPressed = null;
        this.onExitPressed = null;
    }

    private handleExitClick(): void {
        this.onExitPressed?.();
    }

    private handleNextClick(): void {
        this.FeedbackPanel.active = false;
        this.onNextPressed?.();
    }

    private handlePlayAgainClick(): void {
        this.onPlayAgainPressed?.();
    }
}
import { _decorator, Component, Button, RichText, Node, Prefab, instantiate, UIOpacity } from 'cc';
import { IQuizGameView } from './IQuizGameView';
import { AnswerButtonView } from 'db://assets/Scripts/QuizGame/Views/AnswerButtonView';
import { StatementAnimationController } from 'db://assets/Scripts/QuizGame/Controllers/StatementAnimationController';

const { ccclass, property } = _decorator;

@ccclass('QuizGameView')
export class QuizGameView extends Component implements IQuizGameView {

    @property(Node)
    public QuizPanel: Node = null!;

    @property(RichText)
    public StatementText: RichText = null!;

    @property(Node)
    public AnswerLayout: Node = null!;

    @property(Prefab)
    public AnswerButtonPrefab: Prefab = null!;

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

    public onAnswerSelected: ((index: number) => void) | null = null;

    public onPlayAgainPressed: (() => void) | null = null;

    public onNextPressed: (() => void) | null = null;

    private _animController: StatementAnimationController = null!;

    protected onLoad(): void {
        this.NextButton.node.on(Button.EventType.CLICK, this.handleNextClick, this);
        this.PlayAgainButton.node.on(Button.EventType.CLICK, this.handlePlayAgainClick, this);

        this._animController = new StatementAnimationController(
            this.StatementText.node,
            this.AnswerLayout,
            this.FeedbackPanel,
            this.ResultsPanel
        );
    }

    protected onDestroy(): void {
        this.unbindAll();
    }

    public showQuestion(statement: string, answers: string[]): void {
        this.StatementText.string = statement;
        this.AnswerLayout.removeAllChildren();
        this.setAnswers(answers);
    }

    private setAnswers(answers: string[]): void {
        answers.forEach((text, index) => this.setAnswer(text, index));
    }

    private setAnswer(answerText: string, index: number): void {
        const node = instantiate(this.AnswerButtonPrefab);
        const answerButtonView = node.getComponent(AnswerButtonView)!;
        answerButtonView.Label.string = answerText;
        answerButtonView.Button.node.on(
            Button.EventType.CLICK,
            () => this.onAnswerSelected?.(index),
            this
        );
        this.AnswerLayout.addChild(node);
    }

    public showFeedback(wasCorrect: boolean, correctText: string): void {
        this.QuizPanel.active = false;
        this.FeedbackPanel.active = true;
        this.resetOpacity(this.FeedbackPanel);
        this.FeedbackText.string = wasCorrect
            ? '<color=#44ff44><b>✓ Correct!</b></color>'
            : `<color=#ff4444><b>✗ Wrong!</b></color>\n` +
            `<color=#ffffff>Correct answer: ${correctText}</color>`;
    }

    public showResults(score: number, total: number): void {
        this.QuizPanel.active = false;
        this.ResultsPanel.active = true;
        this.ResultsText.string =
            `<color=#ffffff><b>Quiz Finished!</b></color>\n` +
            `<color=#ffdd44>Score: ${score} / ${total}</color>`;
    }

    public showQuestionPanel(): void {
        this.QuizPanel.active = true;
        this.FeedbackPanel.active = false;
        this.ResultsPanel.active = false;
    }

    public hideAllPanels(): void {
        this.QuizPanel.active = false;
        this.FeedbackPanel.active = false;
        this.ResultsPanel.active = false;
    }

    public onSceneFadeInCompleted(): void {
        this.showQuestionPanel();
        this.setAnswersInteractable(false);
        this._animController.playStatementFade(() => this.setAnswersInteractable(true));
    }

    public unbindAll(): void {
        this.NextButton?.node.off(Button.EventType.CLICK, this.handleNextClick, this);
        this.PlayAgainButton?.node.off(Button.EventType.CLICK, this.handlePlayAgainClick, this);
        if (this.AnswerLayout?.isValid) {
            this.AnswerLayout.removeAllChildren();
        }

        this.onAnswerSelected = null;
        this.onNextPressed = null;
        this.onPlayAgainPressed = null;
    }

    private handleNextClick(): void {
        this.NextButton.interactable = false;
        this._animController.playFeedbackFadeOut(() => {
            this.FeedbackPanel.active = false;
            this.onNextPressed?.();

            if (!this.ResultsPanel.active) {
                this.showQuestionPanel();
                this.setAnswersInteractable(false);
                this._animController.playStatementFade(() => {
                    this.NextButton.interactable = true;
                    this.setAnswersInteractable(true);
                });
            } else {
                this.NextButton.interactable = true;
                this._animController.playResultsFadeIn();
            }
        });
    }

    private handlePlayAgainClick(): void {
        this.PlayAgainButton.interactable = false;
        this._animController.playResultsFadeOut(() => {
            this.ResultsPanel.active = false;
            this.onPlayAgainPressed?.();
            this.setAnswersInteractable(false);
            this._animController.playStatementFade(() => {
                this.PlayAgainButton.interactable = true;
                this.setAnswersInteractable(true);
            });
        });
    }

    private setAnswersInteractable(value: boolean): void {
        this.AnswerLayout.children.forEach(child => {
            const answerBtn = child.getComponent(AnswerButtonView);
            if (answerBtn?.Button?.isValid) {
                answerBtn.Button.interactable = value;
            }
        });
    }

    private resetOpacity(node: Node): void {
        const uiOpacity = node.getComponent(UIOpacity);
        if (uiOpacity) uiOpacity.opacity = 255;
    }
}
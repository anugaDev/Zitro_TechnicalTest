import { _decorator, Component, Button, RichText, Node, Prefab, instantiate, UIOpacity } from 'cc';
import { IQuizGameView } from './IQuizGameView';
import { AnswerButtonView } from 'db://assets/Scripts/QuizGame/Views/AnswerButtonView';
import { StatementAnimationController } from 'db://assets/Scripts/QuizGame/Controllers/StatementAnimationController';

const { ccclass, property } = _decorator;

@ccclass('QuizGameView')
export class QuizGameView extends Component implements IQuizGameView
{

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

    public onNextPressed: (() => boolean) | null = null;

    private _animController: StatementAnimationController = null!;

    protected onLoad(): void
    {
        this.setButtonListeners();
        this._animController = new StatementAnimationController(
            this.StatementText.node,
            this.AnswerLayout,
            this.FeedbackPanel,
            this.ResultsPanel
        );
    }

    private setButtonListeners(): void
    {
        this.NextButton.node.on(Button.EventType.CLICK, this.handleNextClick, this);
        this.PlayAgainButton.node.on(Button.EventType.CLICK, this.handlePlayAgainClick, this);
    }

    protected onDestroy(): void
    {
        this.unbindAll();
    }

    public showQuestion(statement: string, answers: string[]): void
    {
        this.StatementText.string = statement;
        this.AnswerLayout.removeAllChildren();
        this.setAnswers(answers);
    }

    private setAnswers(answers: string[]): void
    {
        answers.forEach((text, index) => this.setAnswer(text, index));
    }

    private setAnswer(answerText: string, index: number): void
    {
        const node = instantiate(this.AnswerButtonPrefab);
        const answerButtonView = node.getComponent(AnswerButtonView)!;
        answerButtonView.Label.string = answerText;
        this.setAnswerButtonListeners(answerButtonView, index)
        this.AnswerLayout.addChild(node);
    }
    private setAnswerButtonListeners(answerButtonView: any, index: number): void
    {
        answerButtonView.Button.node.on(
            Button.EventType.CLICK,
            () => this.onAnswerSelected?.(index), this
        );
    }

    public showFeedback(wasCorrect: boolean, correctText: string): void
    {
        this.QuizPanel.active = false;
        this.FeedbackPanel.active = true;
        this.resetOpacity(this.FeedbackPanel);
        this.FeedbackText.string = wasCorrect
            ? '<color=#44ff44><b>✓ Correct!</b></color>'
            : `<color=#ff4444><b>✗ Wrong!</b></color><br/>` +
            `<color=#ffffff>Correct answer: ${correctText}</color>`;
    }

    public showResults(score: number, total: number): void
    {
        this.QuizPanel.active = false;
        this.ResultsPanel.active = true;
        this.ResultsText.string =
            `<color=#ffffff><b>Quiz Finished!</b></color><br/>` +
            `<color=#ffdd44>Score: ${score} / ${total}</color>`;
    }

    public showQuestionPanel(): void
    {
        this.QuizPanel.active = true;
        this.FeedbackPanel.active = false;
        this.ResultsPanel.active = false;
    }

    public hideAllPanels(): void
    {
        this.QuizPanel.active = false;
        this.FeedbackPanel.active = false;
        this.ResultsPanel.active = false;
    }

    public onSceneFadeInCompleted(): void
    {
        this.showQuestionPanel();
        this.setAnswersInteractable(false);
        this._animController.playStatementFade(() => this.setAnswersInteractable(true));
    }

    public unbindAll(): void
    {
        this.removeEventListeners();
        this.removeAllChildren();
        this.onAnswerSelected = null;
        this.onNextPressed = null;
        this.onPlayAgainPressed = null;
    }

    private removeEventListeners(): void
    {
        this.NextButton?.node.off(Button.EventType.CLICK, this.handleNextClick, this);
        this.PlayAgainButton?.node.off(Button.EventType.CLICK, this.handlePlayAgainClick, this);
    }

    private removeAllChildren(): void
    {
        if (!this.AnswerLayout?.isValid)
        {
            return;
        }
        this.AnswerLayout.removeAllChildren();
    }

    private handleNextClick(): void
    {
        this.NextButton.interactable = false;
        this._animController.playFeedbackFadeOut(() => this.onFeedbackFadeOutFinished());
    }

    private onFeedbackFadeOutFinished(): void
    {
        this.FeedbackPanel.active = false;
        this.showQuestionPanel();
        this.setAnswersInteractable(false);
        const hasMoreQuestions = this.onNextPressed?.() ?? false;

        if (hasMoreQuestions)
        {
            this._animController.playStatementFade(() => this.onNextStatementFadeFinished());
        }
        else
        {
            this.PlayAgainButton.interactable = false;
            this._animController.playResultsFadeIn(() => this.onResultsFadeInFinished());
        }
    }

    private onNextStatementFadeFinished(): void
    {
        this.NextButton.interactable = true;
        this.setAnswersInteractable(true);
    }

    private onResultsFadeInFinished(): void
    {
        this.NextButton.interactable = true;
        this.PlayAgainButton.interactable = true;
    }

    private handlePlayAgainClick(): void
    {
        this.PlayAgainButton.interactable = false;
        this._animController.playResultsFadeOut(() => this.onResultsFadeOutFinished());
    }

    private onResultsFadeOutFinished(): void
    {
        this.ResultsPanel.active = false;
        this.showQuestionPanel();
        this.setAnswersInteractable(false);
        this.onPlayAgainPressed?.();
        this._animController.playStatementFade(() => this.onPlayAgainStatementFadeFinished());
    }

    private onPlayAgainStatementFadeFinished(): void
    {
        this.PlayAgainButton.interactable = true;
        this.setAnswersInteractable(true);
    }

    private setAnswersInteractable(value: boolean): void
    {
        this.AnswerLayout.children.forEach(child => this.setAnswerButtonInteractable(child, value));
    }
    private setAnswerButtonInteractable(child: Node, value: boolean): void
    {
        const answerButton = child.getComponent(AnswerButtonView);
        if (!answerButton?.Button?.isValid)
        {
            return;
        }
        answerButton.Button.interactable = value;
    }

    private resetOpacity(node: Node): void
    {
        const uiOpacity = node.getComponent(UIOpacity);
        if (uiOpacity)
        {
            uiOpacity.opacity = 255;
        }
        node.children.forEach(child => this.resetOpacity(child));
    }
}
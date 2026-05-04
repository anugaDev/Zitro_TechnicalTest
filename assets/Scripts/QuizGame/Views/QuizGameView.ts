import { _decorator, Component } from 'cc';
import { IQuizGameView } from './IQuizGameView';
import { QuestionPanelView } from './QuestionPanelView';
import { FeedbackPanelView } from './FeedbackPanelView';
import { ResultsPanelView } from './ResultsPanelView';
import { StatementAnimationHandler } from './Handlers/StatementAnimationHandler';

const { ccclass, property } = _decorator;

@ccclass('QuizGameView')
export class QuizGameView extends Component implements IQuizGameView
{
    @property(QuestionPanelView)
    public QuestionPanel: QuestionPanelView = null!;

    @property(FeedbackPanelView)
    public FeedbackPanel: FeedbackPanelView = null!;

    @property(ResultsPanelView)
    public ResultsPanel: ResultsPanelView = null!;

    public onAnswerSelected: ((index: number) => void) | null = null;

    public onNextPressed: (() => void) | null = null;

    public onPlayAgainPressed: (() => void) | null = null;

    public onFeedbackFadeOutCompleted: (() => void) | null = null;

    public onStatementFadeCompleted: (() => void) | null = null;

    public onResultsFadeInCompleted: (() => void) | null = null;

    public onResultsFadeOutCompleted: (() => void) | null = null;

    private _animController: StatementAnimationHandler = null!;

    protected onLoad(): void
    {
        this._animController = new StatementAnimationHandler(
            this.QuestionPanel.StatementText.node,
            this.QuestionPanel.AnswerLayout,
            this.FeedbackPanel.node,
            this.ResultsPanel.node
        );

        this.QuestionPanel.onAnswerSelected = (index) => this.onAnswerSelected?.(index);
        this.FeedbackPanel.onNextClicked = () => this.onNextPressed?.();
        this.ResultsPanel.onPlayAgainClicked = () => this.onPlayAgainPressed?.();
    }

    protected onDestroy(): void
    {
        this.unbindAll();
    }

    public showQuestion(statement: string, answers: string[]): void
    {
        this.QuestionPanel.show(statement, answers);
    }

    public showFeedback(wasCorrect: boolean, correctText: string): void
    {
        this.QuestionPanel.setActive(false);
        this.FeedbackPanel.show(wasCorrect, correctText);
    }

    public showResults(score: number, total: number): void
    {
        this.QuestionPanel.setActive(false);
        this.ResultsPanel.show(score, total);
    }

    public showQuestionPanel(): void
    {
        this.QuestionPanel.setActive(true);
        this.FeedbackPanel.setActive(false);
        this.ResultsPanel.setActive(false);
    }

    public hideAllPanels(): void
    {
        this.QuestionPanel.setActive(false);
        this.FeedbackPanel.setActive(false);
        this.ResultsPanel.setActive(false);
    }

    public onSceneFadeInCompleted(): void
    {
        this.showQuestionPanel();
        this.setAnswerButtonsInteractable(false);
        this.playStatementFade();
    }

    public playFeedbackFadeOut(): void
    {
        this._animController.playFeedbackFadeOut(() => this.onFeedbackFadeOutCompleted?.());
    }

    public playStatementFade(): void
    {
        this._animController.playStatementFade(() => this.onStatementFadeCompleted?.());
    }

    public playResultsFadeIn(): void
    {
        this._animController.playResultsFadeIn(() => this.onResultsFadeInCompleted?.());
    }

    public playResultsFadeOut(): void
    {
        this._animController.playResultsFadeOut(() => this.onResultsFadeOutCompleted?.());
    }

    public setAnswerButtonsInteractable(value: boolean): void
    {
        this.QuestionPanel.setInteractable(value);
    }

    public setNextButtonInteractable(value: boolean): void
    {
        this.FeedbackPanel.setNextInteractable(value);
    }

    public setPlayAgainInteractable(value: boolean): void
    {
        this.ResultsPanel.setPlayAgainInteractable(value);
    }

    public unbindAll(): void
    {
        if (this.FeedbackPanel?.isValid)
        {
            this.FeedbackPanel.unbind();
        }
        if (this.ResultsPanel?.isValid)
        {
            this.ResultsPanel.unbind();
        }
        if (this.QuestionPanel?.isValid)
        {
            this.QuestionPanel.clear();
            this.QuestionPanel.onAnswerSelected = null;
        }

        this.onAnswerSelected = null;
        this.onNextPressed = null;
        this.onPlayAgainPressed = null;
        this.onFeedbackFadeOutCompleted = null;
        this.onStatementFadeCompleted = null;
        this.onResultsFadeInCompleted = null;
        this.onResultsFadeOutCompleted = null;
    }
}
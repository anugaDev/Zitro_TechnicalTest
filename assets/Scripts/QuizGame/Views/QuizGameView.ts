import { _decorator, Component } from 'cc';
import { IQuizGameView } from './IQuizGameView';
import { QuestionPanelView } from 'db://assets/Scripts/QuizGame/Views/QuestionPanelView';
import { FeedbackPanelView } from 'db://assets/Scripts/QuizGame/Views/FeedbackPanelView';
import { ResultsPanelView } from 'db://assets/Scripts/QuizGame/Views/ResultsPanelView';
import { StatementAnimationHandler } from 'db://assets/Scripts/QuizGame/Views/Handlers/StatementAnimationHandler';

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

    public onNextPressed: (() => boolean) | null = null;

    public onPlayAgainPressed: (() => void) | null = null;

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
        this.FeedbackPanel.onNextClicked = () => this.handleNextClick();
        this.ResultsPanel.onPlayAgainClicked = () => this.handlePlayAgainClick();
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
        this.QuestionPanel.setInteractable(false);
        this._animController.playStatementFade(() => this.QuestionPanel.setInteractable(true));
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
    }

    private handleNextClick(): void
    {
        this.FeedbackPanel.setNextInteractable(false);
        this._animController.playFeedbackFadeOut(() => this.onFeedbackFadeOutFinished());
    }

    private onFeedbackFadeOutFinished(): void
    {
        this.FeedbackPanel.setActive(false);
        this.showQuestionPanel();
        const hasMoreQuestions = this.onNextPressed?.() ?? false;
        this.QuestionPanel.setInteractable(false);

        if (hasMoreQuestions)
        {
            this._animController.playStatementFade(() => this.onNextStatementFadeFinished());
        }
        else
        {
            this.ResultsPanel.setPlayAgainInteractable(false);
            this._animController.playResultsFadeIn(() => this.onResultsFadeInFinished());
        }
    }

    private onNextStatementFadeFinished(): void
    {
        this.FeedbackPanel.setNextInteractable(true);
        this.QuestionPanel.setInteractable(true);
    }

    private onResultsFadeInFinished(): void
    {
        this.FeedbackPanel.setNextInteractable(true);
        this.ResultsPanel.setPlayAgainInteractable(true);
    }

    private handlePlayAgainClick(): void
    {
        this.ResultsPanel.setPlayAgainInteractable(false);
        this._animController.playResultsFadeOut(() => this.onResultsFadeOutFinished());
    }

    private onResultsFadeOutFinished(): void
    {
        this.ResultsPanel.setActive(false);
        this.showQuestionPanel();
        this.onPlayAgainPressed?.();
        this.QuestionPanel.setInteractable(false);
        this._animController.playStatementFade(() => this.onPlayAgainStatementFadeFinished());
    }

    private onPlayAgainStatementFadeFinished(): void
    {
        this.ResultsPanel.setPlayAgainInteractable(true);
        this.QuestionPanel.setInteractable(true);
    }
}
import { IQuizGameModel } from '../Models/IQuizGameModel';
import { IQuizGameView } from '../Views/IQuizGameView';

export class QuizGameController
{
    constructor(
        private readonly model: IQuizGameModel,
        private readonly view: IQuizGameView
    ) {}

    public init(): void
    {
        this.setViewListeners();
        this.view.hideAllPanels();
        this.displayCurrentQuestion();
    }

    public dispose(): void
    {
        this.view.unbindAll();
    }

    private setViewListeners(): void
    {
        this.view.onAnswerSelected = (index) => this.onAnswerSelected(index);
        this.view.onNextPressed = () => this.onNextPressed();
        this.view.onPlayAgainPressed = () => this.onPlayAgainPressed();
    }

    private displayCurrentQuestion(): void
    {
        const question = this.model.getCurrentQuestion();
        this.view.showQuestion(question.statement, question.answers.map(a => a.text));
    }

    private onAnswerSelected(index: number): void
    {
        const wasCorrect = this.model.submitAnswer(index);
        const correctText = this.model.getCurrentQuestion().answers.find(a => a.isCorrect)!.text;
        this.view.showFeedback(wasCorrect, correctText);
    }

    private onNextPressed(): void
    {
        this.view.setNextButtonInteractable(false);
        this.view.playFeedbackFadeOut(() => this.onFeedbackFadeOutFinished());
    }

    private onFeedbackFadeOutFinished(): void
    {
        this.view.showQuestionPanel();
        const hasMoreQuestions = this.model.nextQuestion();

        if (hasMoreQuestions)
        {
            this.displayCurrentQuestion();
            this.view.setAnswerButtonsInteractable(false);
            this.view.playStatementFade(() => this.onStatementFadeFinished());
        }
        else
        {
            this.view.setPlayAgainInteractable(false);
            this.view.showResults(this.model.getScore(), this.model.getTotalQuestions());
            this.view.playResultsFadeIn(() => this.onResultsFadeInFinished());
        }
    }

    private onStatementFadeFinished(): void
    {
        this.view.setNextButtonInteractable(true);
        this.view.setAnswerButtonsInteractable(true);
    }

    private onResultsFadeInFinished(): void
    {
        this.view.setNextButtonInteractable(true);
        this.view.setPlayAgainInteractable(true);
    }

    private onPlayAgainPressed(): void
    {
        this.view.setPlayAgainInteractable(false);
        this.view.playResultsFadeOut(() => this.onPlayAgainFadeOutFinished());
    }

    private onPlayAgainFadeOutFinished(): void
    {
        this.model.reset();
        this.view.showQuestionPanel();
        this.displayCurrentQuestion();
        this.view.setAnswerButtonsInteractable(false);
        this.view.playStatementFade(() => this.onPlayAgainStatementFadeFinished());
    }

    private onPlayAgainStatementFadeFinished(): void
    {
        this.view.setPlayAgainInteractable(true);
        this.view.setAnswerButtonsInteractable(true);
    }
}
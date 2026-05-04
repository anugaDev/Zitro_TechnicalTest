import { IQuizGameModel } from '../Models/IQuizGameModel';
import { IQuizGameView } from '../Views/IQuizGameView';

export class QuizGameController {
    constructor(
        private readonly model: IQuizGameModel,
        private readonly view: IQuizGameView
    ) { }

    public init(): void {
        this.setViewListeners();
        this.view.hideAllPanels();
        this.displayCurrentQuestion();
    }

    public dispose(): void {
        this.view.unbindAll();
    }

    private setViewListeners(): void {
        this.view.onAnswerSelected = (index) => this.onAnswerSelected(index);
        this.view.onNextPressed = () => this.onNextPressed();
        this.view.onPlayAgainPressed = () => this.onPlayAgainPressed();

        this.view.onFeedbackFadeOutCompleted = () => this.onFeedbackFadeOutFinished();
        this.view.onStatementFadeCompleted = () => this.onStatementFadeFinished();
        this.view.onResultsFadeInCompleted = () => this.onResultsFadeInFinished();
        this.view.onResultsFadeOutCompleted = () => this.onPlayAgainFadeOutFinished();
    }

    private displayCurrentQuestion(): void {
        const question = this.model.getCurrentQuestion();
        this.view.showQuestion(question.statement, this.model.getCurrentAnswers());
    }

    private onAnswerSelected(index: number): void {
        const wasCorrect = this.model.submitAnswer(index);
        this.view.showFeedback(wasCorrect, this.model.getCorrectAnswerText());
    }

    private onNextPressed(): void {
        this.view.setNextButtonInteractable(false);
        this.view.playFeedbackFadeOut();
    }

    private onFeedbackFadeOutFinished(): void {
        this.view.showQuestionPanel();
        const hasMoreQuestions = this.model.nextQuestion();

        if (hasMoreQuestions) {
            this.displayNextQuestion();
        }
        else {
            this.displayFinalResults();
        }
    }

    private displayNextQuestion(): void {
        this.displayCurrentQuestion();
        this.view.setAnswerButtonsInteractable(false);
        this.view.playStatementFade();
    }

    private displayFinalResults(): void {
        this.view.setPlayAgainInteractable(false);
        this.view.showResults(this.model.getScore(), this.model.getTotalQuestions());
        this.view.playResultsFadeIn();
    }

    private onStatementFadeFinished(): void {
        this.view.setNextButtonInteractable(true);
        this.view.setPlayAgainInteractable(true);
        this.view.setAnswerButtonsInteractable(true);
    }

    private onResultsFadeInFinished(): void {
        this.view.setNextButtonInteractable(true);
        this.view.setPlayAgainInteractable(true);
    }

    private onPlayAgainPressed(): void {
        this.view.setPlayAgainInteractable(false);
        this.view.playResultsFadeOut();
    }

    private onPlayAgainFadeOutFinished(): void {
        this.model.reset();
        this.view.showQuestionPanel();
        this.displayCurrentQuestion();
        this.view.setAnswerButtonsInteractable(false);
        this.view.playStatementFade();
    }
}
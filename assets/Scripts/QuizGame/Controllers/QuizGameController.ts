import { IQuizGameModel } from '../Models/IQuizGameModel';
import { IQuizGameView } from '../Views/IQuizGameView';

export class QuizGameController {

    constructor(
        private readonly model: IQuizGameModel,
        private readonly view: IQuizGameView
    ) {}

    public init(): void {
        this.view.onAnswerSelected = (index) => this.onAnswerSelected(index);
        this.view.onPlayAgainPressed = () => this.onPlayAgain();
        this.view.onNextPressed = () => this.onNextStatement();

        this.view.hideAllPanels();
        this.displayCurrentQuestion();
    }

    public dispose(): void {
        this.view.unbindAll();
    }

    private displayCurrentQuestion(): void {
        const question = this.model.getCurrentQuestion();
        this.view.showQuestion(question.statement, question.answers.map(answer => answer.text));
    }

    private onAnswerSelected(index: number): void {
        const wasCorrect = this.model.submitAnswer(index);
        const correctText = this.model.getCurrentQuestion().answers.find(answer => answer.isCorrect)!.text;
        this.view.showFeedback(wasCorrect, correctText);
    }

    private onNextStatement(): void {
        const isLastStatement = this.model.nextQuestion();

        if (isLastStatement) {
            this.displayCurrentQuestion();
        }
        else {
            this.view.showResults(this.model.getScore(), this.model.getTotalQuestions());
        }
    }

    private onPlayAgain(): void {
        this.model.reset();
        this.view.showQuestionPanel();
        this.displayCurrentQuestion();
    }
}
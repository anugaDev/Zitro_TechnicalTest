import { Node } from 'cc';
import { AnimationController } from 'db://assets/Scripts/Core/Animations/AnimationController';
import { StatementFadeAnimation } from 'db://assets/Scripts/Core/Animations/StatementFadeAnimation';
import { FadeInAnimation } from 'db://assets/Scripts/Core/Animations/FadeInAnimation';
import { FadeOutAnimation } from 'db://assets/Scripts/Core/Animations/FadeOutAnimation';

export class StatementAnimationController {

    private readonly _animations: AnimationController;

    constructor(
        statementNode: Node,
        answersNode: Node,
        feedbackPanel: Node,
        resultsPanel: Node
    ) {
        this._animations = new AnimationController([
            new StatementFadeAnimation('statementFade', statementNode, answersNode),
            new FadeInAnimation('resultsFadeIn', resultsPanel, 0.4),
            new FadeOutAnimation('feedbackFadeOut', feedbackPanel, 0.3),
            new FadeOutAnimation('resultsFadeOut', resultsPanel, 0.3),
        ]);
    }

    public playStatementFade(): void {
        this._animations.play('statementFade');
    }

    public playFeedbackFadeOut(onCompleted: () => void): void {
        this._animations.onFinished = (id) => {
            if (id !== 'feedbackFadeOut') return;
            onCompleted();
        };
        this._animations.play('feedbackFadeOut');
    }

    public playResultsFadeOut(onCompleted: () => void): void {
        this._animations.onFinished = (id) => {
            if (id !== 'resultsFadeOut') return;
            onCompleted();
        };
        this._animations.play('resultsFadeOut');
    }

    public playResultsFadeIn(): void {
        this._animations.play('resultsFadeIn');
    }
}

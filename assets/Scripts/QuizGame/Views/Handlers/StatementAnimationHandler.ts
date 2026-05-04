import { Node } from 'cc';
import { AnimationController } from 'db://assets/Scripts/Core/Animations/AnimationController';
import { StatementFadeAnimation } from 'db://assets/Scripts/Core/Animations/StatementFadeAnimation';
import { FadeInAnimation } from 'db://assets/Scripts/Core/Animations/FadeInAnimation';
import { FadeOutAnimation } from 'db://assets/Scripts/Core/Animations/FadeOutAnimation';

export class StatementAnimationHandler
{
    private readonly _animations: AnimationController;

    constructor(statementNode: Node, answersNode: Node, feedbackPanel: Node, resultsPanel: Node)
    {
        this._animations = new AnimationController([
            new StatementFadeAnimation('statementFade', statementNode, answersNode),
            new FadeInAnimation('resultsFadeIn', resultsPanel, 0.4),
            new FadeOutAnimation('feedbackFadeOut', feedbackPanel, 0.3),
            new FadeOutAnimation('resultsFadeOut', resultsPanel, 0.3),
        ]);
    }

    public playStatementFade(onCompleted: () => void): void
    {
        this.subscribeOnFinished('statementFade', onCompleted);
        this._animations.play('statementFade');
    }

    public playFeedbackFadeOut(onCompleted: () => void): void
    {
        this.subscribeOnFinished('feedbackFadeOut', onCompleted);
        this._animations.play('feedbackFadeOut');
    }

    public playResultsFadeOut(onCompleted: () => void): void
    {
        this.subscribeOnFinished('resultsFadeOut', onCompleted);
        this._animations.play('resultsFadeOut');
    }

    public playResultsFadeIn(onCompleted: () => void): void
    {
        this.subscribeOnFinished('resultsFadeIn', onCompleted);
        this._animations.play('resultsFadeIn');
    }

    private subscribeOnFinished(animationId: string, onCompleted: () => void): void
    {
        this._animations.onFinished = (id) =>
        {
            if (id !== animationId) return;
            onCompleted();
        };
    }
}

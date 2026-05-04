import { Node } from 'cc';
import { AnimationController } from 'db://assets/Scripts/Core/Animations/AnimationController';
import { StatementFadeAnimation } from 'db://assets/Scripts/Core/Animations/StatementFadeAnimation';
import { FadeInAnimation } from 'db://assets/Scripts/Core/Animations/FadeInAnimation';
import { FadeOutAnimation } from 'db://assets/Scripts/Core/Animations/FadeOutAnimation';

export class StatementAnimationHandler
{
    private static readonly RESULTS_FADE_IN_DURATION: number = 0.4;

    private static readonly FEEDBACK_FADE_OUT_DURATION: number = 0.3;

    private static readonly RESULTS_FADE_OUT_DURATION: number = 0.3;

    private readonly _animations: AnimationController;

    constructor(statementNode: Node, answersNode: Node, feedbackPanel: Node, resultsPanel: Node)
    {
        this._animations = new AnimationController([
            new StatementFadeAnimation('statementFade', statementNode, answersNode),
            new FadeInAnimation('resultsFadeIn', resultsPanel, StatementAnimationHandler.RESULTS_FADE_IN_DURATION),
            new FadeOutAnimation('feedbackFadeOut', feedbackPanel, StatementAnimationHandler. FEEDBACK_FADE_OUT_DURATION),
            new FadeOutAnimation('resultsFadeOut', resultsPanel, StatementAnimationHandler.RESULTS_FADE_OUT_DURATION),
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
            if (id !== animationId)
            {
                return;
            }

            onCompleted();
        };
    }
}

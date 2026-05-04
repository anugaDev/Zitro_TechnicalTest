import { Node, UIOpacity } from 'cc';
import { IAnimation } from './IAnimation';
import { FadeInAnimation } from './FadeInAnimation';

export class StatementFadeAnimation implements IAnimation
{
    public readonly Id: string;

    public onFinished: (() => void) | null = null;

    private readonly _statementFade: FadeInAnimation;

    private readonly _answersFade: FadeInAnimation;

    private readonly _answersOpacity: UIOpacity;

    private _waitTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(
        id: string,
        statementNode: Node,
        answersNode: Node,
        private readonly fadeDuration: number = 0.4,
        private readonly waitDuration: number = 0.4
    )
    {
        this.Id = id;

        this._statementFade = new FadeInAnimation(`${id}_statement`, statementNode, fadeDuration);

        this._answersFade = new FadeInAnimation(`${id}_answers`, answersNode, fadeDuration);

        this._answersOpacity = answersNode.getComponent(UIOpacity)!;
    }

    public play(): void
    {
        this.cancel();

        this._answersOpacity.opacity = 0;

        this._statementFade.onFinished = () =>
        {
            this._waitTimer = setTimeout(() =>
            {
                this._waitTimer = null;
                this._answersFade.onFinished = () => this.onFinished?.();
                this._answersFade.play();
            }, this.waitDuration * 1000);
        };

        this._statementFade.play();
    }

    public cancel(): void
    {
        this._statementFade.cancel();
        this._answersFade.cancel();

        if (this._waitTimer !== null)
        {
            clearTimeout(this._waitTimer);
            this._waitTimer = null;
        }
    }
}

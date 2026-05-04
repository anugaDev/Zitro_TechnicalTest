import { Node, tween, Tween, UIOpacity } from 'cc';
import { IAnimation } from './IAnimation';

export class FadeInAnimation implements IAnimation
{
    private static readonly INITIAL_OPACITY : number = 0;

    private static readonly TARGET_OPACITY : number = 255;

    private static readonly DEFAULT_SPEED : number = 0.5;

    public readonly id: string;

    public onFinished: (() => void) | null = null;

    private readonly _uiOpacity: UIOpacity;

    private _activeTween: Tween<UIOpacity> | null = null;

    constructor(id: string, private readonly target: Node, private readonly duration: number = FadeInAnimation.DEFAULT_SPEED)
    {
        this.id = id;
        this._uiOpacity = target.getComponent(UIOpacity) ?? target.addComponent(UIOpacity);
        this._uiOpacity.opacity = 0;
    }

    public play(): void
    {
        this._activeTween?.stop();

        this._uiOpacity.opacity = FadeInAnimation.INITIAL_OPACITY;

        this._activeTween = tween(this._uiOpacity)
            .to(this.duration, { opacity: FadeInAnimation.TARGET_OPACITY })
            .call(() =>
            {
                this._activeTween = null;
                this.onFinished?.();
            })
            .start();
    }
}

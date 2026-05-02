import { Node, tween, Tween, UIOpacity } from 'cc';
import { IAnimation } from './IAnimation';

export class FadeInAnimation implements IAnimation {

    public readonly id: string;
    public onFinished: (() => void) | null = null;

    private readonly _uiOpacity: UIOpacity;
    private _activeTween: Tween<UIOpacity> | null = null;

    constructor(id: string, private readonly target: Node, private readonly duration: number = 0.5) {
        this.id = id;
        this._uiOpacity = target.getComponent(UIOpacity) ?? target.addComponent(UIOpacity);
        this._uiOpacity.opacity = 0;
    }

    public play(): void {
        this._activeTween?.stop();

        this._uiOpacity.opacity = 0;

        this._activeTween = tween(this._uiOpacity)
            .to(this.duration, { opacity: 255 })
            .call(() => {
                this._activeTween = null;
                this.onFinished?.();
            })
            .start();
    }
}

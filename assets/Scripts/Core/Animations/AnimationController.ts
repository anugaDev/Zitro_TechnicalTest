import { IAnimation } from './IAnimation';

export class AnimationController
{
    public onFinished: ((animationId: string) => void) | null = null;

    private readonly _animations: Map<string, IAnimation>;

    constructor(animations: IAnimation[])
    {
        this._animations = new Map(animations.map(animation => [animation.Id, animation]));
    }

    public play(id: string): void
    {
        const anim = this._animations.get(id);

        if (!anim)
        {
            return;
        }

        anim.onFinished = () => this.onFinished?.(id);
        anim.play();
    }
}

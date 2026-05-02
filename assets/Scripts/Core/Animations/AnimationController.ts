import { IAnimation } from './IAnimation';

export class AnimationController {

    public onFinished: ((animationId: string) => void) | null = null;

    private readonly _animations: Map<string, IAnimation>;

    constructor(animations: IAnimation[]) {
        this._animations = new Map(animations.map(a => [a.id, a]));

        animations.forEach(a => {
            a.onFinished = () => this.onFinished?.(a.id);
        });
    }

    public play(id: string): void {
        const anim = this._animations.get(id);

        if (!anim) {
            console.warn(`[AnimationController] Animation not found: '${id}'`);
            return;
        }

        anim.play();
    }
}

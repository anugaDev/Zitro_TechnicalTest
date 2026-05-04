import { _decorator, Component, Button, Node } from 'cc';
import { IGameSceneView } from './IGameSceneView';
import { AnimationController } from 'db://assets/Scripts/Core/Animations/AnimationController';
import { FadeInAnimation } from 'db://assets/Scripts/Core/Animations/FadeInAnimation';
import { FadeOutAnimation } from 'db://assets/Scripts/Core/Animations/FadeOutAnimation';

const { ccclass, property } = _decorator;

@ccclass('GameSceneView')
export class GameSceneView extends Component implements IGameSceneView {

    @property(Button)
    public ExitButton: Button = null!;

    @property(Node)
    public SceneRoot: Node = null!;

    public onExitPressed: (() => void) | null = null;

    private _animations: AnimationController = null!;

    protected onLoad(): void {
        this.ExitButton.node.on(Button.EventType.CLICK, this.handleExitClick, this);

        this._animations = new AnimationController([
            new FadeInAnimation ('fadeIn',  this.SceneRoot, 0.5),
            new FadeOutAnimation('fadeOut', this.SceneRoot, 0.5),
        ]);
    }

    protected onDestroy(): void {
        this.unbind();
    }

    public playFadeIn(onFinished: () => void): void {
        this._animations.onFinished = () => onFinished();
        this._animations.play('fadeIn');
    }

    public playFadeOut(onFinished: () => void): void {
        this._animations.onFinished = () => onFinished();
        this._animations.play('fadeOut');
    }

    public unbind(): void {
        if (this.ExitButton?.isValid) {
            this.ExitButton.node.off(Button.EventType.CLICK, this.handleExitClick, this);
        }
        this.onExitPressed = null;
    }

    private handleExitClick(): void {
        this.ExitButton.interactable = false;
        this.onExitPressed?.();
    }
}

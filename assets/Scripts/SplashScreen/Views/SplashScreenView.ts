import { _decorator, Component, ProgressBar } from 'cc';
import { ISplashScreenView } from './ISplashScreenView';
import { AnimationController } from 'db://assets/Scripts/Core/Animations/AnimationController';
import { FadeOutAnimation } from 'db://assets/Scripts/Core/Animations/FadeOutAnimation';

const { ccclass, property } = _decorator;

@ccclass('SplashScreenView')
export class SplashScreenView extends Component implements ISplashScreenView {

    @property(ProgressBar)
    public ProgressBar: ProgressBar = null!;

    private _animations: AnimationController = null!;

    protected onLoad(): void {
        this._animations = new AnimationController([
            new FadeOutAnimation('fadeOut', this.node, 0.5),
        ]);
    }

    public setProgressBar(progress: number): void {
        this.ProgressBar.progress = progress;
    }

    public playFadeOut(onFinished: () => void): void {
        this._animations.onFinished = () => onFinished();
        this._animations.play('fadeOut');
    }

    public unbindAll(): void {}
}
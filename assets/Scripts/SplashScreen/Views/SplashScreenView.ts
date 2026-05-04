import { _decorator, Component, ProgressBar, Label } from 'cc';
import { ISplashScreenView } from './ISplashScreenView';
import { AnimationController } from '../../Core/Animations/AnimationController';
import { FadeOutAnimation } from '../../Core/Animations/FadeOutAnimation';
import { ApiResult } from '../../ResourceLoad/ApiResult';

const { ccclass, property } = _decorator;

@ccclass('SplashScreenView')
export class SplashScreenView extends Component implements ISplashScreenView {
    @property(ProgressBar)
    public ProgressBar: ProgressBar = null!;

    @property(Label)
    public AssetStatusLabel: Label = null!;

    private _animations: AnimationController = null!;

    protected onLoad(): void {
        this._animations = new AnimationController([
            new FadeOutAnimation('fadeOut', this.node, 0.5),
        ]);
    }

    public setProgressBar(progress: number): void {
        this.ProgressBar.progress = progress;
    }

    public showAssetStatus(result: ApiResult<string>): void {
        console.log('[SplashScreenView] showAssetStatus:', result);

        if (!this.AssetStatusLabel) {
            return;
        }

        if (ApiResult.isSuccess(result)) {
            this.AssetStatusLabel.string = `✓ ${result.data}`;
        } else if (ApiResult.isError(result)) {
            this.AssetStatusLabel.string = `✗ ${result.message}`;
        }
        else {
            this.AssetStatusLabel.string = 'Loading...';
        }
    }

    public showStandBy(): void {
        if (!this.AssetStatusLabel) {
            return;
        }
        this.AssetStatusLabel.string = 'Please stand by...';
    }

    public showStartingGame(): void {
        if (!this.AssetStatusLabel) {
            return;
        }
        this.AssetStatusLabel.string = 'Starting game...';
    }

    public playFadeOut(onFinished: () => void): void {
        this._animations.onFinished = () => onFinished();
        this._animations.play('fadeOut');
    }

    public unbindAll(): void { }
}
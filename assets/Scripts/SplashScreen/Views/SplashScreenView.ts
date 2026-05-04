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

    @property({ type: String })
    public loadingText: string = 'Loading...';

    @property({ type: String })
    public standByText: string = 'Please stand by...';

    @property({ type: String })
    public startingGameText: string = 'Starting game...';

    @property({ type: String })
    public successPrefix: string = '\u2713 ';

    @property({ type: String })
    public errorPrefix: string = '\u2717 ';

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
        if (ApiResult.isSuccess(result)) {
            this.setStatusLabel(`${this.successPrefix}${result.data}`);
        } else if (ApiResult.isError(result)) {
            this.setStatusLabel(`${this.errorPrefix}${result.message}`);
        } else {
            this.setStatusLabel(this.loadingText);
        }
    }

    public showStandBy(): void {
        this.setStatusLabel(this.standByText);
    }

    public showStartingGame(): void {
        this.setStatusLabel(this.startingGameText);
    }

    private setStatusLabel(text: string): void {
        if (!this.AssetStatusLabel) {
            return;
        }
        this.AssetStatusLabel.string = text;
    }

    public playFadeOut(onFinished: () => void): void {
        this._animations.onFinished = () => onFinished();
        this._animations.play('fadeOut');
    }

    public unbindAll(): void { }
}
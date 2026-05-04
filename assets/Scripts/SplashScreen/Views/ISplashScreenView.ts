import { ApiResult } from '../../ResourceLoad/ApiResult';

export interface ISplashScreenView
{
    unbindAll(): void;

    setProgressBar(progress: number): void;

    playFadeOut(onFinished: () => void): void;

    showAssetStatus(result: ApiResult<string>): void;

    showStandBy(): void;

    showStartingGame(): void;
}
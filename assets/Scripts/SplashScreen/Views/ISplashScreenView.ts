import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';

export interface ISplashScreenView {
    unbindAll(): void;

    setProgressBar(progress: number): void;

    playFadeOut(onFinished: () => void): void;

    showAssetStatus(result: ApiResult<string>): void;

    showStartingGame(): void;
}
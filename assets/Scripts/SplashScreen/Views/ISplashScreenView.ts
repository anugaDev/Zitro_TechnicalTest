export interface ISplashScreenView
{
    unbindAll(): void;

    setProgressBar(progress: number): void;

    playFadeOut(onFinished: () => void): void;
}
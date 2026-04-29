export interface ISplashScreenModel
{
    onLoadedEvent: (() => void) | null;

    onProgressChangedEvent: ((current: number) => void) | null;

    startLoadProcess() : void;

    setCurrentLoadProgress(): void;
}
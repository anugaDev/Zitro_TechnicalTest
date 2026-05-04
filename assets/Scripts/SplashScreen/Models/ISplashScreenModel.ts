import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';

export interface ISplashScreenModel
{
    onLoadedEvent: (() => void) | null;

    onProgressChangedEvent: ((current: number) => void) | null;

    onAssetStatusChangedEvent: ((result: ApiResult<string>) => void) | null;

    onStartingGameEvent: (() => void) | null;

    startLoadProcess() : void;

    setCurrentLoadProgress(): void;
}
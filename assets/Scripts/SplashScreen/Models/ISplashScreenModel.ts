import { ApiResult } from '../../ResourceLoad/ApiResult';

export interface ISplashScreenModel
{
    onLoadedEvent: (() => void) | null;

    onProgressChangedEvent: ((current: number) => void) | null;

    onAssetStatusChangedEvent: ((result: ApiResult<string>) => void) | null;

    onStartingGameEvent: (() => void) | null;

    onStandByEvent: (() => void) | null;

    startLoadProcess() : void;

    setCurrentLoadProgress(): void;
}
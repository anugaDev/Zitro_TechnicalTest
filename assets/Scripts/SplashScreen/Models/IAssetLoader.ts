import { ApiResult } from '../../ResourceLoad/ApiResult';

export interface IAssetLoader
{
    onAssetStatusChanged: ((result: ApiResult<string>) => void) | null;
    load(): Promise<void>;
}

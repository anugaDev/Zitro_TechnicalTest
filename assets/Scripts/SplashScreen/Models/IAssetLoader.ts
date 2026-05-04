import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';

export interface IAssetLoader {
    onAssetStatusChanged: ((result: ApiResult<string>) => void) | null;
    load(): Promise<void>;
}

import { ApiResult } from '../ApiResult';

export interface ITimeService
{
    fetchCurrentTime(): Promise<ApiResult<Date>>;
}

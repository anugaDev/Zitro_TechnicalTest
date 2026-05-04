import { ApiResult } from '../../../ResourceLoad/ApiResult';

export interface ITimeService
{
    fetchCurrentTime(): Promise<ApiResult<Date>>;
}
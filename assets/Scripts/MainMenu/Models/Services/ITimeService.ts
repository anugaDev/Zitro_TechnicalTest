import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';

export interface ITimeService {
    fetchCurrentTime(): Promise<ApiResult<Date>>;
}
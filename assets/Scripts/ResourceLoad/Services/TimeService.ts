import { ITimeService } from './ITimeService';
import { ApiResult } from '../ApiResult';
import { IWorldTimeApiOrgResponse } from '../Entities/IWorldTimeApiOrgResponse';
import { ITimeApiServiceResponse } from '../Entities/ITimeApiServiceResponse';

export class TimeService implements ITimeService
{
    private static readonly PRIMARY_URL =
        'https://worldtimeapi.org/api/timezone/Europe/Madrid';

    private static readonly FALLBACK_URL =
        'https://timeapi.io/api/time/current/zone?timeZone=Europe/Madrid';

    private static readonly TIMEOUT_MS = 8000;

    private static readonly FETCH_HEADERS: HeadersInit = {
        'Accept': 'application/json',
        'Accept-Encoding': 'identity',
    };

    public async fetchCurrentTime(): Promise<ApiResult<Date>>
    {
        const primary = await this.fetchPrimaryTime();
        if (ApiResult.isSuccess(primary))
        {
            return primary;
        }

        const fallback = await this.fetchFallbackTime();
        if (ApiResult.isSuccess(fallback))
        {
            return fallback;
        }

        return ApiResult.success(new Date());
    }

    private fetchPrimaryTime(): Promise<ApiResult<Date>>
    {
        return this.fetchTime<IWorldTimeApiOrgResponse>(
            TimeService.PRIMARY_URL,
            (data) => new Date(data.datetime)
        );
    }

    private fetchFallbackTime(): Promise<ApiResult<Date>>
    {
        return this.fetchTime<ITimeApiServiceResponse>(
            TimeService.FALLBACK_URL,
            (data) => new Date(data.dateTime)
        );
    }

    private async fetchTime<T>(url: string, parseDate: (data: T) => Date): Promise<ApiResult<Date>>
    {
        try
        {
            return await Promise.race([
                this.executeRequest<T>(url, parseDate),
                this.createTimeoutResult(),
            ]);
        }
        catch
        {
            return ApiResult.error<Date>('Request failed');
        }
    }

    private async executeRequest<T>(url: string, parseDate: (data: T) => Date): Promise<ApiResult<Date>>
    {
        const response = await fetch(url, { headers: TimeService.FETCH_HEADERS });

        if (!response.ok)
        {
            return ApiResult.error<Date>(`HTTP ${response.status}`);
        }

        try
        {
            const data: T = await response.json();
            return ApiResult.success(parseDate(data));
        }
        catch
        {
            return ApiResult.error<Date>('Invalid response');
        }
    }

    private createTimeoutResult(): Promise<ApiResult<Date>>
    {
        return new Promise<ApiResult<Date>>(resolve =>
            setTimeout(
                () => resolve(ApiResult.error<Date>('Timeout')),
                TimeService.TIMEOUT_MS
            )
        );
    }
}

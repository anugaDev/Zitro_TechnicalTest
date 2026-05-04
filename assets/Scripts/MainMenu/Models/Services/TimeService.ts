import { ITimeService } from './ITimeService';
import { ApiResult } from '../../../ResourceLoad/ApiResult';
import { IWorldTimeApiOrgResponse } from '../Entities/IWorldTimeApiOrgResponse';
import { ITimeApiServiceResponse } from '../Entities/ITimeApiServiceResponse';

export class TimeService implements ITimeService
{

    private static readonly PRIMARY_URL =
        'https://worldtimeapi.org/api/timezone/Europe/Madrid';

    private static readonly FALLBACK_URL =
        'https://timeapi.io/api/time/current/zone?timeZone=Europe/Madrid';

    private static readonly TIMEOUT_MS = 5000;

    public async fetchCurrentTime(): Promise<ApiResult<Date>>
    {
        const primary = await this.fetchTime<IWorldTimeApiOrgResponse>(
            TimeService.PRIMARY_URL,
            (data) => new Date(data.datetime)
        );

        if (ApiResult.isSuccess(primary))
        {
            return primary;
        }

        console.warn('[TimeService] Primary URL failed, switching to fallback.', ApiResult.isError(primary) ? primary.message : primary.status);

        const fallback = await this.fetchTime<ITimeApiServiceResponse>(
            TimeService.FALLBACK_URL,
            (data) => new Date(data.dateTime)
        );

        if (ApiResult.isSuccess(fallback))
        {
            return fallback;
        }

        console.warn('[TimeService] Fallback URL also failed.', ApiResult.isError(fallback) ? fallback.message : fallback.status);
        return ApiResult.error<Date>('\n' + 'Server time could not be obtained.');
    }

    private async fetchTime<T>(
        url: string,
        parseDate: (data: T) => Date
    ): Promise<ApiResult<Date>>
    {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TimeService.TIMEOUT_MS);

        try
        {
            const response = await fetch(url, { signal: controller.signal });

            if (!response.ok)
            {
                return ApiResult.error<Date>(`HTTP ${response.status} ${response.statusText}`);
            }

            const data: T = await response.json();
            return ApiResult.success(parseDate(data));
        } catch (error)
        {
            return ApiResult.error<Date>(error instanceof Error ? error.message : String(error));
        } finally {
            clearTimeout(timer);
        }
    }
}
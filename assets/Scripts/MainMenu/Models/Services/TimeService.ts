import { ITimeService } from './ITimeService';
import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';
import { IWorldTimeApiOrgResponse } from 'db://assets/Scripts/MainMenu/Models/Entities/IWorldTimeApiOrgResponse';
import { IWorldTimeApiResponse } from 'db://assets/Scripts/MainMenu/Models/Entities/IWorldTimeApiResponse';

export class WorldTimeApiService implements ITimeService {

    private static readonly PRIMARY_URL =
        'https://worldtimeapi.org/api/timezone/Europe/Madrid';

    private static readonly FALLBACK_URL =
        'https://timeapi.io/api/time/current/zone?timeZone=Europe/Madrid';

    private static readonly TIMEOUT_MS = 5000;

    public async fetchCurrentTime(): Promise<ApiResult<Date>> {
        const primary = await this.fetchTime<IWorldTimeApiOrgResponse>(
            WorldTimeApiService.PRIMARY_URL,
            (data) => new Date(data.datetime)
        );

        if (ApiResult.isSuccess(primary)) {
            return primary;
        }

        console.warn('[TimeService] Primary URL failed, switching to fallback.', primary.message);

        const fallback = await this.fetchTime<IWorldTimeApiResponse>(
            WorldTimeApiService.FALLBACK_URL,
            (data) => new Date(data.dateTime)
        );

        if (ApiResult.isSuccess(fallback)) {
            return fallback;
        }

        console.warn('[TimeService] Fallback URL also failed.', fallback.message);
        return ApiResult.error<Date>('No se pudo obtener la hora del servidor.');
    }

    private async fetchTime<T>(
        url: string,
        parseDate: (data: T) => Date
    ): Promise<ApiResult<Date>> {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), WorldTimeApiService.TIMEOUT_MS);

        try {
            const response = await fetch(url, { signal: controller.signal });

            if (!response.ok) {
                return ApiResult.error<Date>(`HTTP ${response.status} ${response.statusText}`);
            }

            const data: T = await response.json();
            return ApiResult.success(parseDate(data));
        } catch (error) {
            return ApiResult.error<Date>(error instanceof Error ? error.message : String(error));
        } finally {
            clearTimeout(timer);
        }
    }
}
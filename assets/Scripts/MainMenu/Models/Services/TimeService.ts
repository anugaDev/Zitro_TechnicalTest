import {ITimeService} from './ITimeService';
import {IWorldTimeApiResponse} from 'db://assets/Scripts/MainMenu/Models/Entities/IWorldTimeApiResponse';
import {IWorldTimeApiOrgResponse} from "db://assets/Scripts/MainMenu/Models/Entities/IWorldTimeApiOrgResponse";

export class WorldTimeApiService implements ITimeService {

    private static readonly PRIMARY_URL =
        'http://worldtimeapi.org/api/timezone/Europe/Madrid';

    private static readonly FALLBACK_URL =
        'https://timeapi.io/api/time/current/zone?timeZone=Europe/Madrid';

    private static readonly TIMEOUT_MS = 5000;

    public async fetchCurrentTime(): Promise<Date> {
        try {
            return await this.fetchTime(
                WorldTimeApiService.PRIMARY_URL,
                '[TimeService] Primary URL failed, switching to fallback.',
                (data: IWorldTimeApiOrgResponse) => new Date(data.datetime)
            );
        } catch {
            return await this.fetchTime(
                WorldTimeApiService.FALLBACK_URL,
                '[TimeService] Fallback URL also failed.',
                (data: IWorldTimeApiResponse) => new Date(data.dateTime)
            );
        }
    }

    private async fetchTime<T>(url: string, errorMessage: string, parseDate: (data: T) => Date): Promise<Date> {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), WorldTimeApiService.TIMEOUT_MS);

        try {
            const response = await fetch(url, { signal: controller.signal });

            if (!response.ok) {
                throw new Error(`${errorMessage} Status: ${response.status} ${response.statusText}`);
            }

            const data: T = await response.json();
            return parseDate(data);
        } catch (error) {
            console.warn(errorMessage, error);
            throw error;
        } finally {
            clearTimeout(timer);
        }
    }
}
import {ITimeService} from './ITimeService';
import {IWorldTimeApiResponse} from "db://assets/Scripts/MainMenu/Models/Services/IWorldTimeApiResponse";

export class WorldTimeApiService implements ITimeService {
    private static readonly URL =
        'https://timeapi.io/api/time/current/zone?timeZone=Europe/Madrid';

    private static readonly TIMEOUT_MS = 5000;

    public async fetchCurrentTime(): Promise<Date> {
        const controller = new AbortController();
        const timer = setTimeout(
            () => controller.abort(),
            WorldTimeApiService.TIMEOUT_MS
        );

        try {
            const response = await fetch(WorldTimeApiService.URL, {
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(
                    `WorldTimeAPI request failed: ${response.status} ${response.statusText}`
                );
            }

            const data: IWorldTimeApiResponse = await response.json();
            return new Date(data.dateTime);
        } finally {
            clearTimeout(timer);
        }
    }
}
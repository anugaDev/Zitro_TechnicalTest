import { ITimeService } from './ITimeService';

export class WorldTimeApiService implements ITimeService {
    private static readonly URL =
        'http://worldtimeapi.org/api/timezone/Europe/Madrid';
    public async fetchCurrentTime(): Promise<Date> {
        const response = await fetch(WorldTimeApiService.URL);
        if (!response.ok) {
            throw new Error(
                `WorldTimeAPI request failed: ${response.status} ${response.statusText}`
            );
        }
        const data: WorldTimeApiResponse = await response.json();
        return new Date(data.datetime);
    }
}
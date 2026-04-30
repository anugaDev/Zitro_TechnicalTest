export interface ITimeService {
    fetchCurrentTime(): Promise<Date>;
}
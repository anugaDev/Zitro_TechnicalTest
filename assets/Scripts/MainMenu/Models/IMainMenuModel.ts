export interface IMainMenuModel
{
    startClock(onTick: (time: string) => void): void;

    stopClock(): void;

    getFormattedTime(): string;
}
export interface IMainMenuModel
{
    initializeTime(): Promise<void>;

    startClock(onTick: (time: string) => void): void;

    stopClock(): void;

    getFormattedTime(): string;

    goToQuiz(): void;

    goToSlot(): void;
}
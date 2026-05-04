import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';

export interface IMainMenuModel
{
    initializeTime(): Promise<ApiResult<Date>>;

    startClock(onTick: (time: string) => void): void;

    stopClock(): void;

    getFormattedTime(): string;

    goToQuiz(): void;

    goToSlot(): void;

    quit(): void;
}
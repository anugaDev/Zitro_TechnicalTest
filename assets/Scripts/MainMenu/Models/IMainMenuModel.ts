import { ApiResult } from '../../ResourceLoad/ApiResult';

export interface IMainMenuModel
{
    initializeTime(): ApiResult<Date>;

    startClock(onTick: (time: string) => void): void;

    stopClock(): void;

    getCurrentTime(): string;

    goToQuiz(): void;

    goToSlot(): void;

    quit(): void;
}
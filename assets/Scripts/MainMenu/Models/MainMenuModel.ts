import { padZero } from '../../Utils/StringUtils';
import {IMainMenuModel} from './IMainMenuModel';

export class MainMenuModel implements IMainMenuModel
{
    private _intervalId: ReturnType<typeof setInterval> | null = null;

    private _currentTime: Date;

    constructor()
    {
        this._currentTime = new Date();
    }

    public startClock(onTick: (time: string) => void): void
    {
        this.stopClock();
        this._intervalId = setInterval(() =>
        {
            this._currentTime = new Date();
            onTick(this.getFormattedTime());
        }, 1000);
    }

    public stopClock(): void
    {
        if (this._intervalId === null)
        {
            return;
        }

        clearInterval(this._intervalId);
        this._intervalId = null;
    }

    public getFormattedTime(): string
    {
        const hours = padZero(this._currentTime.getHours());
        const minutes = padZero(this._currentTime.getMinutes());
        const seconds = padZero(this._currentTime.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    }
}
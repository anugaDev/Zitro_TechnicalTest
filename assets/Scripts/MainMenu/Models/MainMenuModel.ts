import {IMainMenuModel} from "db://assets/Scripts/MainMenu/Models/IMainMenuModel";
import { padZero } from '../../Utils/StringUtils';

export class MainMenuModel implements IMainMenuModel
{
    public static readonly SCENE_QUIZ = 'QuizGameScene';

    public static readonly SCENE_SLOT = 'SlotGameScene';

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
        const h = padZero(this._currentTime.getHours());
        const m = padZero(this._currentTime.getMinutes());
        const s = padZero(this._currentTime.getSeconds());
        return `${h}:${m}:${s}`;
    }
}
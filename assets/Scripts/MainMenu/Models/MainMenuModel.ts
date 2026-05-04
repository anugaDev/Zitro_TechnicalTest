import { padZero } from '../../Utils/StringUtils';
import { IMainMenuModel } from './IMainMenuModel';
import { ITimeService } from 'db://assets/Scripts/MainMenu/Models/Services/ITimeService';
import { ISceneNavigator } from '../../Core/ISceneNavigator';
import { GlobalParameters } from 'db://assets/Scripts/GlobalParameters';
import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';
import { AppCache } from 'db://assets/Scripts/Shared/AppCache';

export class MainMenuModel implements IMainMenuModel
{

    private _intervalId: ReturnType<typeof setInterval> | null = null;

    private _currentTime: Date;

    constructor(
        private readonly timeService: ITimeService,
        private readonly navigator: ISceneNavigator
    )
    {
        this._currentTime = new Date();
    }

    public async initializeTime(): Promise<ApiResult<Date>>
    {
        const cached = AppCache.instance.CachedTime;
        if (cached)
        {
            const elapsed = Date.now() - cached.fetchedAt;
            this._currentTime = new Date(cached.serverTime.getTime() + elapsed);
            return ApiResult.success(this._currentTime);
        }

        const result = await this.timeService.fetchCurrentTime();
        if (ApiResult.isSuccess(result))
        {
            this._currentTime = result.data;
        }
        return result;
    }

    public startClock(onTick: (time: string) => void): void
    {
        this.stopClock();
        this._intervalId = setInterval(() =>
        {
            this._currentTime = new Date(this._currentTime.getTime() + 1000);
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

    public goToQuiz(): void
    {
        this.navigator.goTo(GlobalParameters.SCENE_QUIZ);
    }

    public goToSlot(): void
    {
        this.navigator.goTo(GlobalParameters.SCENE_SLOT);
    }
}
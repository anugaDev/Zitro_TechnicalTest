import { ISceneNavigator } from '../../Core/ISceneNavigator';
import { GlobalParameters } from '../../GlobalParameters';
import { ApiResult } from '../../ResourceLoad/ApiResult';
import { AppCache } from '../../ResourceLoad/AppCache';
import { padZero } from '../../Core/Utils/StringUtils';
import { IMainMenuModel } from './IMainMenuModel';

export class MainMenuModel implements IMainMenuModel
{
    private static readonly SERVER_TIMEOUT_MS = 1000;

    private _intervalId: ReturnType<typeof setInterval> | null = null;

    private _currentTime: Date;

    constructor(private readonly navigator: ISceneNavigator) {
        this._currentTime = new Date();
    }

    public initializeTime(): ApiResult<Date> {
        const cached = AppCache.instance.CachedTime;
        const elapsed = Date.now() - cached.fetchedAt;
        this._currentTime = new Date(cached.serverTime.getTime() + elapsed);
        return ApiResult.success(this._currentTime);
    }

    public startClock(onTick: (time: string) => void): void {
        this.stopClock();
        this._intervalId = setInterval(() => this.getTick(onTick), MainMenuModel.SERVER_TIMEOUT_MS);
    }

    private getTick(onTick: (time: string) => void): void {
        this._currentTime = new Date(this._currentTime.getTime() + MainMenuModel.SERVER_TIMEOUT_MS);
        onTick(this.getCurrentTime());
    }

    public stopClock(): void {
        if (this._intervalId === null) {
            return;
        }
        clearInterval(this._intervalId);
        this._intervalId = null;
    }

    public getCurrentTime(): string {
        const hours = padZero(this._currentTime.getHours());
        const minutes = padZero(this._currentTime.getMinutes());
        const seconds = padZero(this._currentTime.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    }

    public goToQuiz(): void {
        this.navigator.goTo(GlobalParameters.SCENE_QUIZ);
    }

    public goToSlot(): void {
        this.navigator.goTo(GlobalParameters.SCENE_SLOT);
    }

    public quit(): void {
        this.navigator.quit();
    }
}
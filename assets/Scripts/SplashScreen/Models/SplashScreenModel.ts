import {ISplashScreenModel} from './ISplashScreenModel';
import {CounterCoroutine} from "db://assets/Scripts/Core/CounterCoroutine";

export class SplashScreenModel implements ISplashScreenModel
{
    private readonly DEFAULT_LOAD_TIME : number = 5;

    private _progressCounter : CounterCoroutine;

    public onProgressChangedEvent: ((current: number) => void) | null = null;

    public onLoadedEvent: (() => void) | null = null;

    constructor( progressCounter : CounterCoroutine)
    {
        this._progressCounter = progressCounter;
    }

    startLoadProcess(): void {
        this._progressCounter.onFinished = () => this.onCountFinished();
        this._progressCounter.onUpdate = () => this.setCurrentLoadProgress();
        this._progressCounter.startCounter(this.DEFAULT_LOAD_TIME);
    }

    private onCountFinished() {
        this.onLoadedEvent?.();
    }

    public setCurrentLoadProgress(): void
    {
        let currentCount = this._progressCounter.GetCurrentCount();
        let currentLimit = this._progressCounter.GetProgressLimit();
        let currentProgress = currentCount / currentLimit;
        this.onProgressChangedEvent(currentProgress)
    }
}
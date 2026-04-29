import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('CounterCoroutine')
export class CounterCoroutine extends Component {

    private readonly _interval: number = 1;

    private _currentProgress: number = 0;

    private _isRunning: boolean = false;

    private _progressLimit: number;

    public onFinished: (() => void) | null = null;

    public onUpdate: (() => void) | null = null;

    public startCounter(progressLimit: number): void {
        this._progressLimit = progressLimit;
        this._currentProgress = 0;
        this._isRunning = true;
        this.nextTick();
    }

    public stopCounter(): void {
        this._isRunning = false;
        this.unscheduleAllCallbacks();
    }

    private nextTick(): void {
        this.scheduleOnce(() => this.onTick(), this._interval);
    }

    private onTick(): void {

        if (!this._isRunning) {
            return;
        }

        this._currentProgress++;
        this.onUpdate?.();

        if (this._currentProgress >= this._progressLimit) {
            this.onCounterFinished();
        }
        else {
            this.nextTick();
        }
    }

    public GetCurrentCount() : number {
        return this._currentProgress;
    }

    private onCounterFinished(): void {
        this._isRunning = false;
        this.onFinished?.();
    }
    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }
}
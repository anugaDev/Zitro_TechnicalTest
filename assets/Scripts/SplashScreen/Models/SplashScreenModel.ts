import { ISplashScreenModel } from './ISplashScreenModel';
import { CounterCoroutine } from 'db://assets/Scripts/Core/CounterCoroutine';
import { IAssetLoader } from './IAssetLoader';

export class SplashScreenModel implements ISplashScreenModel {
    private static readonly DEFAULT_LOAD_TIME: number = 5;

    private static readonly FILL_DURATION_MS: number = 500;

    private static readonly TIMER_WEIGHT: number = 0.75;

    private static readonly TARGET_FILL: number = 1

    private static readonly TICK_MS: number = 16;

    private _waitingForAssets: boolean = false;

    private _assetsLoaded: boolean = false;

    private _fillIntervalId: number = 0;

    private _fillStartTime:  number = 0;

    private _fillStart: number = 0;

    private _fillRange: number = 0;

    public onProgressChangedEvent: ((current: number) => void) | null = null;

    public onLoadedEvent: (() => void) | null = null;

    constructor(
        private readonly _progressCounter: CounterCoroutine,
        private readonly _assetLoader: IAssetLoader,
    ) { }

    public startLoadProcess(): void {
        this._progressCounter.onUpdate = () => this.setCurrentLoadProgress();
        this._progressCounter.onFinished = () => this.onTimerFinished();
        this._progressCounter.startCounter(SplashScreenModel.DEFAULT_LOAD_TIME);

        this._assetLoader.load().then(() => {
            this._assetsLoaded = true;
            if (this._waitingForAssets) {
                this.animateFillToComplete();
            }
        });
    }

    public setCurrentLoadProgress(): void {
        const current = this._progressCounter.GetCurrentCount();
        const limit = this._progressCounter.GetProgressLimit();
        const progress = (current / limit) * SplashScreenModel.TIMER_WEIGHT;
        this.onProgressChangedEvent?.(progress);
    }

    private onTimerFinished(): void {
        if (this._assetsLoaded) {
            this.animateFillToComplete();
        } else {
            this._waitingForAssets = true;
        }
    }

    private animateFillToComplete(): void {
        this._fillStart = SplashScreenModel.TIMER_WEIGHT;
        this._fillRange = SplashScreenModel.TARGET_FILL - this._fillStart;
        this._fillStartTime = Date.now();
        this._fillIntervalId = setInterval(() => this.onFillTick(), SplashScreenModel.TICK_MS);
    }

    private onFillTick(): void {
        const elapsed = Date.now() - this._fillStartTime;
        const normalizedProgress = Math.min(elapsed / SplashScreenModel.FILL_DURATION_MS, SplashScreenModel.TARGET_FILL);
        this.onProgressChangedEvent?.(this._fillStart + this._fillRange * normalizedProgress);

        if (normalizedProgress >= SplashScreenModel.TARGET_FILL) {
            clearInterval(this._fillIntervalId);
            this.onLoadedEvent?.();
        }
    }
}
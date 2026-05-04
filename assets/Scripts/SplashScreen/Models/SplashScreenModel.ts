import { ISplashScreenModel } from './ISplashScreenModel';
import { CounterCoroutine } from 'db://assets/Scripts/Core/CounterCoroutine';
import { IAssetLoader } from './IAssetLoader';

export class SplashScreenModel implements ISplashScreenModel {

    private static readonly DEFAULT_LOAD_TIME: number  = 5;

    private static readonly FILL_DURATION_MS: number = 500;

    private static readonly TIMER_WEIGHT: number = 0.75;

    private _waitingForAssets: boolean = false;

    private _assetsLoaded: boolean = false;

    public onProgressChangedEvent: ((current: number) => void) | null = null;

    public onLoadedEvent: (() => void) | null = null;

    constructor(
        private readonly _progressCounter: CounterCoroutine,
        private readonly _assetLoader: IAssetLoader,
    ) {}

    public startLoadProcess(): void {
        this._progressCounter.onUpdate   = () => this.setCurrentLoadProgress();
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
        const current  = this._progressCounter.GetCurrentCount();
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
        const START = SplashScreenModel.TIMER_WEIGHT;
        const RANGE = 1.0 - START;
        const startTime = Date.now();

        const intervalId = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const time = Math.min(elapsed / SplashScreenModel.FILL_DURATION_MS, 1.0);
            this.onProgressChangedEvent?.(START + RANGE * time);

            if (time >= 1.0) {
                clearInterval(intervalId);
                this.onLoadedEvent?.();
            }
        }, 16);
    }
}
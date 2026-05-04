import { SpriteAtlas, AudioClip, JsonAsset } from 'cc';
import { IAssetLoader } from './IAssetLoader';
import { ITimeService } from '../../ResourceLoad/Services/ITimeService';
import { AppCache } from '../../ResourceLoad/AppCache';
import { ApiResult } from '../../ResourceLoad/ApiResult';
import { ResourcePaths } from '../../ResourceLoad/ResourcePaths';
import { ResourceLoader } from '../../ResourceLoad/ResourceLoader';

export class SplashAssetLoader implements IAssetLoader {
    private static readonly STEP_DELAY_MS: number = 100;

    public onAssetStatusChanged: ((result: ApiResult<string>) => void) | null = null;

    constructor(private readonly _timeService: ITimeService) { }

    public async load(): Promise<void> {
        await this.loadSpriteAtlas();
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        await this.loadAudioClips();
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        await this.loadQuizConfig();
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        await this.fetchServerTime();
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
    }

    private async loadSpriteAtlas(): Promise<void> {
        this.notifyLoading();
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        const atlas = await ResourceLoader.load(ResourcePaths.SLOT_ATLAS, SpriteAtlas);
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        if (!atlas) {
            this.notifyError('Slot Atlas failed to load');
            return;
        }
        atlas.addRef();
        AppCache.instance.SlotAtlas = atlas;
        this.notifySuccess('Slot Atlas');
    }

    private async loadAudioClips(): Promise<void> {
        this.notifyLoading();
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        const clips = await ResourceLoader.loadDir(ResourcePaths.AUDIO_DIR, AudioClip);
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        if (!clips) {
            this.notifyError('Audio Clips failed to load');
            return;
        }
        clips.forEach(clip => clip.addRef());
        AppCache.instance.AudioClips = clips;
        this.notifySuccess('Audio Clips');
    }

    private async loadQuizConfig(): Promise<void> {
        this.notifyLoading();
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        const json = await ResourceLoader.load(ResourcePaths.QUIZ_JSON, JsonAsset);
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        if (!json) {
            this.notifyError('Quiz Config failed to load');
            return;
        }
        json.addRef();
        AppCache.instance.QuizJson = json;
        this.notifySuccess('Quiz Config');
    }

    private async fetchServerTime(): Promise<void> {
        this.notifyLoading();
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        const result = await this._timeService.fetchCurrentTime();
        await this.wait(SplashAssetLoader.STEP_DELAY_MS);
        if (ApiResult.isSuccess(result)) {
            this.cacheServerTime(result.data);
            this.notifySuccess('Server Time');
        }
        else {
            const message = ApiResult.isError(result) ? result.message : result.status;
            this.notifyError(`Server Time — ${message}`);
        }
    }

    private cacheServerTime(serverTime: Date): void {
        AppCache.instance.CachedTime = {
            serverTime,
            fetchedAt: Date.now(),
        };
    }

    private notifyLoading(): void {
        this.onAssetStatusChanged?.(ApiResult.loading());
    }

    private notifySuccess(assetName: string): void {
        this.onAssetStatusChanged?.(ApiResult.success(assetName));
    }

    private notifyError(message: string): void {
        this.onAssetStatusChanged?.(ApiResult.error(message));
    }

    private wait(milliseconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
}

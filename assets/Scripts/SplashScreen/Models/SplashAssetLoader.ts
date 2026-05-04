import { SpriteAtlas, AudioClip, JsonAsset } from 'cc';
import { IAssetLoader } from './IAssetLoader';
import { ITimeService } from 'db://assets/Scripts/MainMenu/Models/Services/ITimeService';
import { AppCache } from 'db://assets/Scripts/Shared/AppCache';
import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';
import { ResourcePaths } from 'db://assets/Scripts/Shared/ResourcePaths';
import { ResourceLoader } from 'db://assets/Scripts/Shared/ResourceLoader';

export class SplashAssetLoader implements IAssetLoader {

    constructor(private readonly _timeService: ITimeService) { }

    public async load(): Promise<void> {
        await Promise.all([
            this.loadSpriteAtlas(),
            this.loadAudioClips(),
            this.loadQuizConfig(),
            this.fetchServerTime(),
        ]);
    }

    private async loadSpriteAtlas(): Promise<void> {
        const atlas = await ResourceLoader.load(ResourcePaths.SLOT_ATLAS, SpriteAtlas);
        if (!atlas) {
            console.warn('[SplashAssetLoader] Failed to load slot atlas');
            return;
        }
        atlas.addRef();
        AppCache.instance.SlotAtlas = atlas;
    }

    private async loadAudioClips(): Promise<void> {
        const clips = await ResourceLoader.loadDir(ResourcePaths.AUDIO_DIR, AudioClip);
        if (!clips) {
            console.warn('[SplashAssetLoader] Failed to load audio clips');
            return;
        }
        clips.forEach(clip => clip.addRef());
        AppCache.instance.AudioClips = clips;
    }

    private async loadQuizConfig(): Promise<void> {
        const json = await ResourceLoader.load(ResourcePaths.QUIZ_JSON, JsonAsset);
        if (!json) {
            console.warn('[SplashAssetLoader] Failed to load quiz config');
            return;
        }
        json.addRef();
        AppCache.instance.QuizJson = json;
    }

    private async fetchServerTime(): Promise<void> {
        const result = await this._timeService.fetchCurrentTime();
        if (ApiResult.isSuccess(result)) {
            this.cacheServerTime(result.data);
        } else {
            this.logServerTimeError(result);
        }
    }

    private cacheServerTime(serverTime: Date): void {
        AppCache.instance.CachedTime = {
            serverTime,
            fetchedAt: Date.now(),
        };
    }

    private logServerTimeError(result: ApiResult<Date>): void {
        console.warn('[SplashAssetLoader] Failed to fetch server time.',
            ApiResult.isError(result) ? result.message : result.status);
    }
}

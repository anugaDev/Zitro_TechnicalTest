import { resources, SpriteAtlas, AudioClip, JsonAsset } from 'cc';
import { IAssetLoader } from './IAssetLoader';
import { ITimeService } from 'db://assets/Scripts/MainMenu/Models/Services/ITimeService';
import { AppCache } from 'db://assets/Scripts/Shared/AppCache';
import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';
import { ResourcePaths } from 'db://assets/Scripts/Shared/ResourcePaths';

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

    private loadSpriteAtlas(): Promise<void> {
        return new Promise((resolve) => {
            resources.load(ResourcePaths.SLOT_ATLAS, SpriteAtlas, (err, atlas) => {
                if (!err && atlas) {
                    atlas.addRef();
                    AppCache.instance.slotAtlas = atlas;
                } else {
                    console.warn('[SplashAssetLoader] Failed to load slot atlas:', err);
                }
                resolve();
            });
        });
    }

    private loadAudioClips(): Promise<void> {
        return new Promise((resolve) => {
            resources.loadDir(ResourcePaths.AUDIO_DIR, AudioClip, (err, clips) => {
                if (!err && clips?.length > 0) {
                    clips.forEach(clip => clip.addRef());
                    AppCache.instance.audioClips = clips;
                } else {
                    console.warn('[SplashAssetLoader] Failed to load audio clips:', err);
                }
                resolve();
            });
        });
    }

    private loadQuizConfig(): Promise<void> {
        return new Promise((resolve) => {
            resources.load(ResourcePaths.QUIZ_JSON, JsonAsset, (err, json) => {
                if (!err && json) {
                    json.addRef();
                    AppCache.instance.quizJson = json;
                } else {
                    console.warn('[SplashAssetLoader] Failed to load quiz config:', err);
                }
                resolve();
            });
        });
    }

    private async fetchServerTime(): Promise<void> {
        const result = await this._timeService.fetchCurrentTime();
        if (ApiResult.isSuccess(result)) {
            AppCache.instance.cachedTime = {
                serverTime: result.data,
                fetchedAt: Date.now(),
            };
        } else {
            console.warn('[SplashAssetLoader] Failed to fetch server time.',
                ApiResult.isError(result) ? result.message : result.status);
        }
    }
}

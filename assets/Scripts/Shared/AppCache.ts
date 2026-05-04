import {AudioClip, JsonAsset, SpriteAtlas} from 'cc';
import {ICachedTime} from "db://assets/Scripts/Shared/ICachedTime";

export class AppCache {

    private static _instance: AppCache | null = null;

    public static get instance(): AppCache {
        if (!AppCache._instance) {
            AppCache._instance = new AppCache();
        }
        return AppCache._instance;
    }

    private constructor() {}

    public slotAtlas: SpriteAtlas | null = null;

    public audioClips: AudioClip[] | null = null;

    public quizJson: JsonAsset | null = null;

    public cachedTime: ICachedTime | null = null;
}

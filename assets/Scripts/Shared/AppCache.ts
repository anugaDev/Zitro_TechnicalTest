import {AudioClip, JsonAsset, SpriteAtlas} from 'cc';
import {ICachedTime} from "db://assets/Scripts/Shared/ICachedTime";

export class AppCache
{

    private static _instance: AppCache | null = null;

    public static get instance(): AppCache
    {
        if (!AppCache._instance)
        {
            AppCache._instance = new AppCache();
        }
        return AppCache._instance;
    }

    private constructor() {}

    public SlotAtlas: SpriteAtlas | null = null;

    public AudioClips: AudioClip[] | null = null;

    public QuizJson: JsonAsset | null = null;

    public CachedTime: ICachedTime | null = null;
}
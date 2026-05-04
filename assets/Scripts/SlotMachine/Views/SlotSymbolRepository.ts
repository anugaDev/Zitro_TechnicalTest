import { SpriteFrame, SpriteAtlas } from 'cc';
import { SlotSymbolEnum } from '../Enums/SlotSymbolEnum';
import { SlotGameConfiguration } from '../Configuration/SlotGameConfiguration';
import { ResourcePaths } from '../../ResourceLoad/ResourcePaths';
import { AppCache } from '../../ResourceLoad/AppCache';
import { ResourceLoader } from '../../ResourceLoad/ResourceLoader';

export class SlotSymbolRepository
{

    private _frames: SpriteFrame[] = new Array(SlotGameConfiguration.SYMBOL_COUNT).fill(null);

    public get frames(): SpriteFrame[]
    {
        return this._frames;
    }

    public async load(onLoaded: () => void): Promise<void>
    {
        const cachedAtlas = AppCache.instance.SlotAtlas;
        if (cachedAtlas)
        {
            this.loadFromCache(cachedAtlas, onLoaded);
            return;
        }

        await this.loadFromResources(onLoaded);
    }

    private loadFromCache(atlas: SpriteAtlas, onLoaded: () => void): void
    {
        this.populateFrames(atlas);
        onLoaded();
    }

    private async loadFromResources(onLoaded: () => void): Promise<void>
    {
        const atlas = await ResourceLoader.load(ResourcePaths.SLOT_ATLAS, SpriteAtlas);
        if (!atlas)
        {
            console.error('[SlotSymbolRepository] Failed to load atlas');
        }
        else
        {
            this.populateFrames(atlas);
        }
        onLoaded();
    }

    private populateFrames(atlas: SpriteAtlas): void
    {
        for (let i = 0; i < SlotGameConfiguration.SYMBOL_COUNT; i++)
        {
            this._frames[i] = atlas.getSpriteFrame(SlotSymbolEnum[i]);
        }
    }
}

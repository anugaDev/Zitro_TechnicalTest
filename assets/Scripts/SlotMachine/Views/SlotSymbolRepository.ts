import { SpriteFrame, SpriteAtlas, resources } from 'cc';
import { SlotSymbolEnum } from '../Enums/SlotSymbolEnum';
import { SlotGameConfiguration } from '../Configuration/SlotGameConfiguration';
import { ResourcePaths } from 'db://assets/Scripts/Shared/ResourcePaths';
import { AppCache } from 'db://assets/Scripts/Shared/AppCache';

export class SlotSymbolRepository {

    private _frames: SpriteFrame[] = new Array(SlotGameConfiguration.SYMBOL_COUNT).fill(null);

    public get frames(): SpriteFrame[] {
        return this._frames;
    }

    public load(onLoaded: () => void): void {
        const cachedAtlas = AppCache.instance.slotAtlas;
        if (cachedAtlas) {
            this.loadFromCache(cachedAtlas, onLoaded);
            return;
        }

        this.loadFromResources(onLoaded);
    }

    private loadFromCache(atlas: SpriteAtlas, onLoaded: () => void): void {
        this.populateFrames(atlas);
        onLoaded();
    }

    private loadFromResources(onLoaded: () => void): void {
        resources.load(ResourcePaths.SLOT_ATLAS, SpriteAtlas,
            (error, atlas) => this.onAtlasLoaded(error, atlas, onLoaded));
    }

    private onAtlasLoaded(error: Error | null, atlas: SpriteAtlas | null, onLoaded: () => void): void {
        if (error || !atlas) {
            console.error('[SlotSymbolRepository] Failed to load atlas:', error);
        } else {
            this.populateFrames(atlas);
        }
        onLoaded();
    }

    private populateFrames(atlas: SpriteAtlas): void {
        for (let i = 0; i < SlotGameConfiguration.SYMBOL_COUNT; i++) {
            this._frames[i] = atlas.getSpriteFrame(SlotSymbolEnum[i]);
        }
    }
}

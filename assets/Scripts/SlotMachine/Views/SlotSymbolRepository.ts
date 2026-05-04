import { SpriteFrame } from 'cc';
import { SlotSymbolEnum } from '../Enums/SlotSymbolEnum';
import { SlotGameConfiguration } from '../Configuration/SlotGameConfiguration';
import { AppCache } from '../../ResourceLoad/AppCache';

export class SlotSymbolRepository {
    private _frames: SpriteFrame[] = new Array(SlotGameConfiguration.SYMBOL_COUNT).fill(null);

    public get frames(): SpriteFrame[] {
        return this._frames;
    }

    public load(onLoaded: () => void): void {
        this.populateFrames();
        onLoaded();
    }

    private populateFrames(): void {
        const atlas = AppCache.instance.SlotAtlas;
        for (let i = 0; i < SlotGameConfiguration.SYMBOL_COUNT; i++) {
            this._frames[i] = atlas.getSpriteFrame(SlotSymbolEnum[i]);
        }
    }
}
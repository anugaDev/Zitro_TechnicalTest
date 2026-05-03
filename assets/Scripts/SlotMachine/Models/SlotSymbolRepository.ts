import { SpriteFrame, SpriteAtlas } from 'cc';
import { resources } from 'cc';
import { SlotSymbolEnum, SYMBOL_COUNT } from '../Enums/SlotSymbolEnum';
import { ResourcePaths } from 'db://assets/Scripts/Shared/ResourcePaths';

export class SlotSymbolRepository {

    private _frames: SpriteFrame[] = new Array(SYMBOL_COUNT).fill(null);

    public get frames(): SpriteFrame[] {
        return this._frames;
    }

    public load(onLoaded: () => void): void {
        resources.load(ResourcePaths.SLOT_ATLAS, SpriteAtlas, (err, atlas) => {
            if (err || !atlas) {
                console.error('[SlotSymbolRepository] Failed to load atlas:', err);
            } else {
                for (let symbolIndex = 0; symbolIndex < SYMBOL_COUNT; symbolIndex++) {
                    this._frames[symbolIndex] = atlas.getSpriteFrame(SlotSymbolEnum[symbolIndex]);
                }
            }
            onLoaded();
        });
    }
}

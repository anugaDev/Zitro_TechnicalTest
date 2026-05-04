import { ISlotGameModel } from './ISlotGameModel';
import { SlotSymbolEnum } from '../Enums/SlotSymbolEnum';
import { SlotGameConfiguration } from '../Configuration/SlotGameConfiguration';

/**
 * Fake model for testing purposes only.
 * Always generates a winning result (all reels show the same symbol).
 * Swap this for SlotGameModel in the installer to test the win flow.
 */
export class FakeWinSlotGameModel implements ISlotGameModel {

    private readonly FIXED_SYMBOL: SlotSymbolEnum = SlotSymbolEnum.Cherry;

    private _result: SlotSymbolEnum[] = Array(SlotGameConfiguration.REEL_COUNT).fill(this.FIXED_SYMBOL);

    public onWin: (() => void) | null = null;

    public generateResult(): void {
        this._result = Array(SlotGameConfiguration.REEL_COUNT).fill(this.FIXED_SYMBOL);
    }

    public getFinalSymbol(reelIndex: number): SlotSymbolEnum {
        return this._result[reelIndex];
    }

    public notifyResult(): void {
        this.onWin?.();
    }
}

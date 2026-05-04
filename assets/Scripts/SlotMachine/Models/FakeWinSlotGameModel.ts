import { ISlotGameModel } from './ISlotGameModel';
import { SlotSymbolEnum } from '../Enums/SlotSymbolEnum';
import { SlotGameConfiguration } from '../Configuration/SlotGameConfiguration';

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

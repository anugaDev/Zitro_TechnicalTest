import { ISlotGameModel } from './ISlotGameModel';
import { SlotSymbolEnum } from '../Enums/SlotSymbolEnum';
import { SlotGameConfiguration } from '../Configuration/SlotGameConfiguration';

export class SlotGameModel implements ISlotGameModel {

    private _result: SlotSymbolEnum[] = Array(SlotGameConfiguration.REEL_COUNT).fill(0);

    public onWin: (() => void) | null = null;

    public generateResult(): void {
        for (let reelIndex = 0; reelIndex < SlotGameConfiguration.REEL_COUNT; reelIndex++) {
            this._result[reelIndex] = Math.floor(Math.random() * SlotGameConfiguration.SYMBOL_COUNT) as SlotSymbolEnum;
        }
    }

    public getFinalSymbol(reelIndex: number): SlotSymbolEnum {
        return this._result[reelIndex];
    }

    public notifyResult(): void {
        if (!this.checkWin()) {
            return;
        }

        this.onWin?.();
    }

    private checkWin(): boolean {
        return (
            this._result[0] === this._result[1] &&
            this._result[1] === this._result[2]
        );
    }
}
import { ISlotGameModel } from './ISlotGameModel';
import { SlotSymbolEnum, SYMBOL_COUNT, REEL_COUNT } from '../Enums/SlotSymbolEnum';

export class SlotGameModel implements ISlotGameModel {

    private _result: SlotSymbolEnum[] = Array(REEL_COUNT).fill(0);

    public generateResult(): void {
        for (let reelIndex = 0; reelIndex < REEL_COUNT; reelIndex++) {
            this._result[reelIndex] = Math.floor(Math.random() * SYMBOL_COUNT) as SlotSymbolEnum;
        }
    }

    public getFinalSymbol(reelIndex: number): SlotSymbolEnum {
        return this._result[reelIndex];
    }

    public isWin(): boolean {
        return (
            this._result[0] === this._result[1] &&
            this._result[1] === this._result[2]
        );
    }
}
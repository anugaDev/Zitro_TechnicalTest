import { ISlotGameModel } from './ISlotGameModel';
import {SlotSymbolEnum, SYMBOL_COUNT} from '../Enums/SlotSymbolEnum';

export class SlotGameModel implements ISlotGameModel {

    private _result: [SlotSymbolEnum, SlotSymbolEnum, SlotSymbolEnum] = [0, 0, 0];

    public generateResult(): void {
        for (let i = 0; i < 3; i++) {
            this._result[i] = Math.floor(Math.random() * SYMBOL_COUNT) as SlotSymbolEnum;
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
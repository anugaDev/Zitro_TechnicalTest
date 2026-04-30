import { SlotSymbolEnum } from '../Enums/SlotSymbolEnum';

export interface ISlotGameModel {

    generateResult(): void;

    getFinalSymbol(reelIndex: number): SlotSymbolEnum | null;

    isWin(): boolean;
}
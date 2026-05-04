import { SlotSymbolEnum } from '../Enums/SlotSymbolEnum';

export interface ISlotGameModel
{
    onWin: (() => void) | null;

    generateResult(): void;

    getFinalSymbol(reelIndex: number): SlotSymbolEnum | null;

    notifyResult(): void;
}
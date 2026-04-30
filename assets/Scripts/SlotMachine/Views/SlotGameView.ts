import { _decorator, Component, Button, Node } from 'cc';
import { ISlotGameView } from './ISlotGameView';
import {SlotSymbolEnum} from '../Enums/SlotSymbolEnum';
import { ReelView } from './ReelView';
const { ccclass, property } = _decorator;

@ccclass('SlotGameView')
export class SlotGameView extends Component implements ISlotGameView {

    @property([ReelView])
    public reels: ReelView[] = [];

    @property(Button)
    public SpinButton: Button = null!;

    @property(Node)
    public WinPanel: Node = null!;

    protected onLoad(): void {
        this.reels.forEach(r => r.buildStrip());
        this.hideWin();
    }

    public startReelSpin(reelIndex: number): void {
        this.reels[reelIndex].startSpin();
    }

    public stopReel(reelIndex: number, symbolId: number, onStopped: () => void) : void {
        this.reels[reelIndex].stopSpin(symbolId as SlotSymbolEnum, onStopped);
    }

    public showWin(): void  {
        this.WinPanel.active = true;
    }

    public hideWin(): void  {
        this.WinPanel.active = false;
    }

    public setSpinButtonInteractable(value: boolean): void {
        this.SpinButton.interactable = value;
    }

    public bindSpinButton(handler: () => void): void {
        this.SpinButton.node.on(Button.EventType.CLICK, handler, this);
    }

    public unbindAll(): void {
        if (this.SpinButton?.isValid) {
            this.SpinButton.node.off(Button.EventType.CLICK);
        }
    }
}
import { ISlotGameModel } from '../Models/ISlotGameModel';
import { ISlotGameView } from '../Views/ISlotGameView';
import { SlotGameConfiguration } from '../Configuration/SlotGameConfiguration';

export class SlotGameController {

    private _pendingTimers: ReturnType<typeof setTimeout>[] = [];

    constructor(
        private readonly model: ISlotGameModel,
        private readonly view: ISlotGameView
    ) { }

    public init(): void {
        this.model.onWin = () => this.view.showWin();
        this.view.bindSpinButton(() => this.onSpin());
        this.view.setSpinButtonInteractable(false);
        this.view.hideWin();
    }

    public dispose(): void {
        this._pendingTimers.forEach(id => clearTimeout(id));
        this._pendingTimers = [];
        this.view.cancelAllReels();
        this.view.unbindAll();
        this.model.onWin = null;
    }

    private onSpin(): void {
        this.prepareForSpin();
        this.scheduleReelStarts();
        this.scheduleReelStops();
    }

    private prepareForSpin(): void {
        this.view.setSpinButtonInteractable(false);
        this.view.hideWin();
        this.model.generateResult();
    }

    private scheduleReelStarts(): void {
        for (let i = 0; i < SlotGameConfiguration.REEL_COUNT; i++) {
            this.delay(SlotGameConfiguration.REEL_STAGGER_MS * i, () => this.view.startReelSpin(i));
        }
    }

    private scheduleReelStops(): void {
        const stopBase = SlotGameConfiguration.REEL_STAGGER_MS * (SlotGameConfiguration.REEL_COUNT - 1) + SlotGameConfiguration.MIN_ALL_SPIN_MS;
        for (let reelIndex = 0; reelIndex < SlotGameConfiguration.REEL_COUNT - 1; reelIndex++) {
            this.delay(stopBase + SlotGameConfiguration.REEL_STAGGER_MS * reelIndex, () => this.stopReel(reelIndex));
        }
        this.delay(stopBase + SlotGameConfiguration.REEL_STAGGER_MS * (SlotGameConfiguration.REEL_COUNT - 1), () => this.stopLastReel());
    }

    private stopReel(reelIndex: number, onStopped: () => void = () => { }): void {
        const symbol = this.model.getFinalSymbol(reelIndex);
        this.view.stopReel(reelIndex, symbol, onStopped);
    }

    private stopLastReel(): void {
        this.stopReel(SlotGameConfiguration.REEL_COUNT - 1, () => this.onAllReelsStopped());
    }

    private onAllReelsStopped(): void {
        this.model.notifyResult();
        this.view.setSpinButtonInteractable(true);
    }

    private delay(ms: number, cb: () => void): void {
        const id = setTimeout(cb, ms);
        this._pendingTimers.push(id);
    }
}
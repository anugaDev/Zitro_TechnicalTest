import { ISlotGameModel } from '../Models/ISlotGameModel';
import { ISlotGameView } from '../Views/ISlotGameView';

export class SlotGameController {

    private readonly REEL_STAGGER_MS : number  = 2000;

    private readonly MIN_ALL_SPIN_MS : number  = 3000;

    constructor(
        private readonly model: ISlotGameModel,

        private readonly view: ISlotGameView
    ) {}

    public init(): void {
        this.view.bindSpinButton(() => this.onSpin());
        this.view.setSpinButtonInteractable(true);
        this.view.hideWin();
    }
    public dispose(): void {
        this.view.unbindAll();
    }

    private onSpin(): void {
        this.view.setSpinButtonInteractable(false);
        this.view.hideWin();
        this.model.generateResult();

        this.delay(0, () => this.view.startReelSpin(0));
        this.delay(this.REEL_STAGGER_MS, () => this.view.startReelSpin(1));
        this.delay(this.REEL_STAGGER_MS * 2,() => this.view.startReelSpin(2));

        const stopBase = this.REEL_STAGGER_MS * 2 + this.MIN_ALL_SPIN_MS;
        this.delay(stopBase, () => this.stopReel(0));
        this.delay(stopBase + this.REEL_STAGGER_MS, () => this.stopReel(1));
        this.delay(stopBase + this.REEL_STAGGER_MS * 2, () => this.stopReel(2, true));
    }

    private stopReel(reelIndex: number, isLast: boolean = false): void {
        const symbol = this.model.getFinalSymbol(reelIndex);
        this.view.stopReel(reelIndex, symbol, () => {
            if (isLast) this.onAllReelsStopped();
        });
    }
    private onAllReelsStopped(): void {
        if (this.model.isWin()) {
            this.view.showWin();
        }
        this.view.setSpinButtonInteractable(true);
    }

    private delay(ms: number, cb: () => void): void {
        setTimeout(cb, ms);
    }
}
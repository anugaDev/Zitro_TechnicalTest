export interface ISlotGameView {

    startReelSpin(reelIndex: number): void;

    stopReel(reelIndex: number, symbolId: number, onStopped: () => void): void;

    cancelAllReels(): void;

    showWin(): void;

    hideWin(): void;

    setSpinButtonInteractable(value: boolean): void;

    bindSpinButton(handler: () => void): void;

    onSceneFadeInCompleted(): void;

    onSceneFadeOutStarted(): void;

    unbindAll(): void;
}
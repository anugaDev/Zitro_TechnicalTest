import { _decorator, Component, Button, Node, AudioSource, AudioClip } from 'cc';
import { ISlotGameView } from './ISlotGameView';
import { SlotSymbolEnum } from '../Enums/SlotSymbolEnum';
import { ReelView } from './ReelView';
import { SlotSymbolRepository } from '../Models/SlotSymbolRepository';

const { ccclass, property } = _decorator;

@ccclass('SlotGameView')
export class SlotGameView extends Component implements ISlotGameView {

    @property([ReelView])
    public reels: ReelView[] = [];

    @property(Button)
    public SpinButton: Button = null!;

    @property(Node)
    public WinPanel: Node = null!;

    @property(AudioSource)
    public Audio: AudioSource = null!;

    @property(AudioClip)
    public SpinStartClip: AudioClip = null!;

    @property(AudioClip)
    public SpinLoopClip: AudioClip = null!;

    @property(AudioClip)
    public WinClip: AudioClip = null!;

    public onAllReelsReady: (() => void) | null = null;

    protected onLoad(): void {
        this.hideWin();
        const repository = new SlotSymbolRepository();
        repository.load(() => {
            this.reels.forEach(reel => {
                reel.setSymbolFrames(repository.frames);
                reel.buildStrip();
            });
            this.onAllReelsReady?.();
        });
    }

    public startReelSpin(reelIndex: number): void {
        if (reelIndex === 0 && this.Audio) {
            this.Audio.playOneShot(this.SpinStartClip);
            this.Audio.clip = this.SpinLoopClip;
            this.Audio.loop = true;
            this.Audio.play();
        }
        this.reels[reelIndex].startSpin();
    }

    public stopReel(reelIndex: number, symbolId: number, onStopped: () => void): void {
        this.reels[reelIndex].stopSpin(symbolId as SlotSymbolEnum, onStopped);
    }

    public showWin(): void {
        this.WinPanel.active = true;
        this.Audio?.playOneShot(this.WinClip);
    }

    public hideWin(): void {
        this.WinPanel.active = false;
    }

    public setSpinButtonInteractable(value: boolean): void {
        this.SpinButton.interactable = value;
        if (value) this.Audio?.stop();
    }

    public bindSpinButton(handler: () => void): void {
        this.SpinButton.node.on(Button.EventType.CLICK, handler, this);
    }

    public cancelAllReels(): void {
        this.Audio?.stop();
        this.reels?.forEach(reel => {
            this.cancelReel(reel);
        });
    }

    private cancelReel(reel : ReelView): void {
        if (!reel?.isValid) {
            return;
        }
        reel.cancelSpin();
    }

    public onSceneFadeInCompleted(): void {
        this.setSpinButtonInteractable(true);
    }

    public onSceneFadeOutStarted(): void {
        this.setSpinButtonInteractable(false);
    }

    public unbindAll(): void {
        if (this.SpinButton?.isValid) {
            this.SpinButton.node.off(Button.EventType.CLICK);
        }
    }
}
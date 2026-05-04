import { _decorator, Component, Node, SpriteFrame, tween, Tween, Vec3, AudioSource, AudioClip } from 'cc';
import { SlotSymbolEnum } from '../Enums/SlotSymbolEnum';
import { SlotGameConfiguration } from '../Configuration/SlotGameConfiguration';
import { ReelStripBuilder } from './ReelStripBuilder';

const { ccclass, property } = _decorator;

@ccclass('ReelView')
export class ReelView extends Component
{

    @property(Node)
    public stripNode: Node = null!;

    @property(AudioSource)
    public Audio: AudioSource = null!;

    @property(AudioClip)
    public StopClip: AudioClip = null!;

    private _symbolFrames: SpriteFrame[] = [];

    private _isSpinning: boolean = false;

    private _stripY: number = 0;

    private _activeTween: Tween<Node> | null = null;

    private readonly _stripBuilder: ReelStripBuilder =
        new ReelStripBuilder(SlotGameConfiguration.CELL_HEIGHT, SlotGameConfiguration.STRIP_BUFFER);

    private get _loopHeight(): number
    {
        return SlotGameConfiguration.SYMBOL_COUNT * SlotGameConfiguration.CELL_HEIGHT;
    }

    protected update(deltaTime: number): void
    {
        if (!this._isSpinning)
        {
            return;
        }

        this.setReelPosition(deltaTime);
    }

    private setReelPosition(deltaTime: number): void
    {
        this._stripY -= SlotGameConfiguration.SPIN_SPEED * deltaTime;

        if (this._stripY <= -this._loopHeight)
        {
            this._stripY += this._loopHeight;
        }

        this.stripNode.setPosition(0, this._stripY, 0);
    }

    public setSymbolFrames(frames: SpriteFrame[]): void
    {
        this._symbolFrames = frames;
    }

    public buildStrip(): void
    {
        if (this._symbolFrames.length === 0)
        {
            return;
        }

        this._stripY = this._stripBuilder.build(this.stripNode, this._symbolFrames);
        this.stripNode.setPosition(0, this._stripY, 0);
    }

    public startSpin(): void
    {
        this._isSpinning = true;
    }

    public stopSpin(targetSymbol: SlotSymbolEnum, onStopped: () => void): void
    {
        this._isSpinning = false;
        const targetY = this.calculateTargetY(targetSymbol);
        this.playStopTween(targetY, onStopped);
    }

    private calculateTargetY(targetSymbol: SlotSymbolEnum): number
    {
        return -((SlotGameConfiguration.STRIP_BUFFER + targetSymbol) * SlotGameConfiguration.CELL_HEIGHT);
    }

    private playStopTween(targetY: number, onStopped: () => void): void
    {
        this._activeTween = tween(this.stripNode)
            .to(SlotGameConfiguration.STOP_TWEEN_DURATION, { position: new Vec3(0, targetY, 0) }, { easing: 'cubicOut' })
            .call(() => this.onStopTweenFinished(targetY, onStopped)).start();
    }

    private onStopTweenFinished(targetY: number, onStopped: () => void): void
    {
        this._activeTween = null;
        this._stripY = targetY;
        this.Audio?.playOneShot(this.StopClip);
        onStopped();
    }

    public cancelSpin(): void
    {
        this._isSpinning = false;
        this._activeTween?.stop();
        this._activeTween = null;
    }
}
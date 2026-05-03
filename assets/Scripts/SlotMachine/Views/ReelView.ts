import { _decorator, Component, Node, SpriteFrame, tween, Tween, Vec3, AudioSource, AudioClip } from 'cc';
import { SlotSymbolEnum, SYMBOL_COUNT } from '../Enums/SlotSymbolEnum';
import { ReelStripBuilder } from './ReelStripBuilder';

const { ccclass, property } = _decorator;

@ccclass('ReelView')
export class ReelView extends Component {

    private readonly CELL_HEIGHT: number = 120;
    private readonly STRIP_BUFFER: number = 3;
    private readonly SPIN_SPEED: number = 1200;
    private readonly STOP_TWEEN_DURATION: number = 0.35;

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
        new ReelStripBuilder(this.CELL_HEIGHT, this.STRIP_BUFFER);

    private get _loopHeight(): number {
        return SYMBOL_COUNT * this.CELL_HEIGHT;
    }

    protected update(dt: number): void {
        if (!this._isSpinning) return;

        this._stripY -= this.SPIN_SPEED * dt;

        if (this._stripY <= -this._loopHeight) {
            this._stripY += this._loopHeight;
        }

        this.stripNode.setPosition(0, this._stripY, 0);
    }

    public setSymbolFrames(frames: SpriteFrame[]): void {
        this._symbolFrames = frames;
    }

    public buildStrip(): void {
        if (this._symbolFrames.length === 0) return;
        this._stripY = this._stripBuilder.build(this.stripNode, this._symbolFrames);
        this.stripNode.setPosition(0, this._stripY, 0);
    }

    public startSpin(): void {
        this._isSpinning = true;
    }

    public stopSpin(targetSymbol: SlotSymbolEnum, onStopped: () => void): void {
        this._isSpinning = false;

        const targetY = -((this.STRIP_BUFFER + targetSymbol) * this.CELL_HEIGHT);

        this._activeTween = tween(this.stripNode)
            .to(this.STOP_TWEEN_DURATION, { position: new Vec3(0, targetY, 0) }, { easing: 'cubicOut' })
            .call(() => {
                this._activeTween = null;
                this._stripY = targetY;
                this.Audio?.playOneShot(this.StopClip);
                onStopped();
            })
            .start();
    }

    public cancelSpin(): void {
        this._isSpinning = false;
        this._activeTween?.stop();
        this._activeTween = null;
    }
}
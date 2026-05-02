import { _decorator, Component, Node, SpriteFrame, Sprite, tween, Tween, Vec3, UITransform, AudioSource, AudioClip } from 'cc';
import { resources } from 'cc';
import { SlotSymbolEnum, SYMBOL_COUNT } from '../Enums/SlotSymbolEnum';

const { ccclass, property } = _decorator;

@ccclass('ReelView')
export class ReelView extends Component {

    private readonly CELL_HEIGHT: number = 120;

    private readonly STRIP_BUFFER: number = 3;

    private readonly _spinSpeed: number = 1200;

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

    private get _loopHeight(): number {
        return SYMBOL_COUNT * this.CELL_HEIGHT;
    }

    protected update(dt: number): void {
        if (!this._isSpinning) return;

        this._stripY -= this._spinSpeed * dt;

        if (this._stripY <= -this._loopHeight) {
            this._stripY += this._loopHeight;
        }

        this.stripNode.setPosition(0, this._stripY, 0);
    }

    public loadSymbols(onLoaded: () => void): void {
        this._symbolFrames = new Array(SYMBOL_COUNT).fill(null);

        resources.loadDir('SlotSprites', SpriteFrame, (err, frames) => {
            if (err) {
                console.error('[ReelView] Failed to load slot sprites:', err);
            } else {
                frames.forEach((frame) => {
                    const symbolIndex = SlotSymbolEnum[frame.name as keyof typeof SlotSymbolEnum] as unknown as number;
                    if (symbolIndex !== undefined && symbolIndex >= 0) {
                        this._symbolFrames[symbolIndex] = frame;
                    }
                });
            }
            onLoaded();
        });
    }


    public startSpin(): void {
        this._isSpinning = true;
    }

    public stopSpin(targetSymbol: SlotSymbolEnum, onStopped: () => void): void {
        this._isSpinning = false;

        const targetY = -((this.STRIP_BUFFER + targetSymbol) * this.CELL_HEIGHT);

        this._activeTween = tween(this.stripNode)
            .to(0.35, { position: new Vec3(0, targetY, 0) }, { easing: 'cubicOut' })
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

    public buildStrip(): void {
        this.stripNode.removeAllChildren();

        if (this._symbolFrames.length === 0) return;

        const full: number[] = [];
        for (let j = SYMBOL_COUNT - this.STRIP_BUFFER; j < SYMBOL_COUNT; j++) full.push(j);
        for (let j = 0; j < SYMBOL_COUNT; j++) full.push(j);
        for (let j = 0; j < this.STRIP_BUFFER; j++) full.push(j);

        full.forEach((symbolId, i) => {
            const cell = new Node(`cell_${i}`);
            cell.layer = this.stripNode.layer;
            cell.addComponent(Sprite).spriteFrame = this._symbolFrames[symbolId] ?? null;
            const cellTransform = cell.addComponent(UITransform);
            cellTransform.setContentSize(this.CELL_HEIGHT, this.CELL_HEIGHT);
            cell.setPosition(0, i * this.CELL_HEIGHT, 0);
            this.stripNode.addChild(cell);
        });

        this._stripY = -Math.floor(this.STRIP_BUFFER / 2) * this.CELL_HEIGHT;
        this.stripNode.setPosition(0, this._stripY, 0);
    }
}
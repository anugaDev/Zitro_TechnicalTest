import { _decorator, Component, Node, SpriteAtlas, SpriteFrame, Sprite,
    tween, Vec3, UITransform } from 'cc';
import {SlotSymbolEnum, SYMBOL_COUNT} from '../Enums/SlotSymbolEnum';

const { ccclass, property } = _decorator;

@ccclass('ReelView')
export class ReelView extends Component {

    private readonly CELL_HEIGHT : number = 120;

    private readonly STRIP_BUFFER : number = 3;

    private readonly _spinSpeed: number = 1200;
    
    @property(SpriteAtlas)
    public symbolAtlas: SpriteAtlas = null!

    @property(Node)
    public stripNode: Node = null!;

    private _isSpinning: boolean = false;

    private _stripY: number = 0;

    private get _stripHeight(): number {
        return (SYMBOL_COUNT + this.STRIP_BUFFER * 2) * this.CELL_HEIGHT;
    }

    protected update(dt: number): void {
        if (!this._isSpinning) return;
        this._stripY -= this._spinSpeed * dt;
        const loopHeight = SYMBOL_COUNT * this.CELL_HEIGHT;
        if (this._stripY <= -loopHeight) {
            this._stripY += loopHeight;
        }
        this.stripNode.setPosition(0, this._stripY, 0);
    }

    public startSpin(): void {
        this._isSpinning = true;
    }

    public stopSpin(targetSymbol: SlotSymbolEnum, onStopped: () => void): void {
        this._isSpinning = false;
        const targetY = -(targetSymbol * this.CELL_HEIGHT);
        tween(this.stripNode)
            .to(0.35, { position: new Vec3(0, targetY, 0) }, { easing: 'cubicOut' })
            .call(() => {
                this._stripY = targetY;
                onStopped();
            })
            .start();
    }

    public buildStrip(): void {
        this.stripNode.removeAllChildren();

        const order = [...Array(SYMBOL_COUNT).keys()];
        const full  = [
            ...order.slice(-this.STRIP_BUFFER),
            ...order,
            ...order.slice(0, this.STRIP_BUFFER),
        ];

        full.forEach((symbolId, i) => {
            const frameName   = SlotSymbolEnum[symbolId];          // e.g. "Cherry"
            const spriteFrame = this.symbolAtlas.getSpriteFrame(frameName);
            if (!spriteFrame) {
                console.warn(`[ReelView] Missing atlas frame: "${frameName}"`);
            }
            const cell = new Node(`cell_${i}`);
            cell.addComponent(Sprite).spriteFrame = spriteFrame;
            const cellTransform = cell.addComponent(UITransform);
            cellTransform.setContentSize(this.CELL_HEIGHT, this.CELL_HEIGHT);
            cell.setPosition(0, -(i * this.CELL_HEIGHT), 0);
            this.stripNode.addChild(cell);
        });
    }
}
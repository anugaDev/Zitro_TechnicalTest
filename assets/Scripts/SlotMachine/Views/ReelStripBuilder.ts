import { Node, SpriteFrame, Sprite, UITransform } from 'cc';
import { SYMBOL_COUNT } from '../Enums/SlotSymbolEnum';

export class ReelStripBuilder {

    constructor(
        private readonly cellHeight: number,
        private readonly stripBuffer: number
    ) {}

    public build(stripNode: Node, symbolFrames: SpriteFrame[]): number {
        stripNode.removeAllChildren();

        const sequence = this.buildSequence();

        sequence.forEach((symbolId, index) => {
            const cell = this.createCell(index, symbolFrames[symbolId], stripNode.layer);
            cell.setPosition(0, index * this.cellHeight, 0);
            stripNode.addChild(cell);
        });

        return -Math.floor(this.stripBuffer / 2) * this.cellHeight;
    }

    private buildSequence(): number[] {
        const sequence: number[] = [];

        for (let symbolIndex = SYMBOL_COUNT - this.stripBuffer; symbolIndex < SYMBOL_COUNT; symbolIndex++) {
            sequence.push(symbolIndex);
        }
        for (let symbolIndex = 0; symbolIndex < SYMBOL_COUNT; symbolIndex++) {
            sequence.push(symbolIndex);
        }
        for (let symbolIndex = 0; symbolIndex < this.stripBuffer; symbolIndex++) {
            sequence.push(symbolIndex);
        }

        return sequence;
    }

    private createCell(index: number, frame: SpriteFrame | null, layer: number): Node {
        const cell = new Node(`cell_${index}`);
        cell.layer = layer;
        cell.addComponent(Sprite).spriteFrame = frame ?? null;

        const transform = cell.addComponent(UITransform);
        transform.setContentSize(this.cellHeight, this.cellHeight);

        return cell;
    }
}

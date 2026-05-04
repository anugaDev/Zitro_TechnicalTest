import { _decorator, Component, Button, RichText, Color } from 'cc';
import { ColorUtils } from '../../Core/Utils/ColorUtils';

const { ccclass, property } = _decorator;

@ccclass('ResultsPanelView')
export class ResultsPanelView extends Component {
    @property(RichText)
    public ResultsText: RichText = null!;

    @property(Button)
    public PlayAgainButton: Button = null!;

    @property({ type: String })
    public titleLabel: string = 'Quiz Finished!';

    @property({ type: String })
    public scorePrefix: string = 'Score: ';

    @property(Color)
    public titleColor: Color = new Color(255, 255, 255, 255);

    @property(Color)
    public scoreColor: Color = new Color(255, 221, 68, 255);

    public onPlayAgainClicked: (() => void) | null = null;

    protected onLoad(): void {
        this.PlayAgainButton.node.on(Button.EventType.CLICK, this.handlePlayAgainClick, this);
    }

    private handlePlayAgainClick(): void {
        this.onPlayAgainClicked?.();
    }

    public show(score: number, total: number): void {
        this.node.active = true;
        this.ResultsText.string = this.getResultsText(score, total);
    }

    private getResultsText(score: number, total: number): string {
        return `<color=${ColorUtils.toHex(this.titleColor)}><b>${this.titleLabel}</b></color><br/>` +
               `<color=${ColorUtils.toHex(this.scoreColor)}>${this.scorePrefix}${score} / ${total}</color>`;
    }

    public setPlayAgainInteractable(value: boolean): void {
        if (this.PlayAgainButton?.isValid) {
            this.PlayAgainButton.interactable = value;
        }
    }

    public setActive(value: boolean): void {
        this.node.active = value;
    }

    public unbind(): void {
        this.PlayAgainButton?.node.off(Button.EventType.CLICK, this.handlePlayAgainClick, this);
        this.onPlayAgainClicked = null;
    }
}

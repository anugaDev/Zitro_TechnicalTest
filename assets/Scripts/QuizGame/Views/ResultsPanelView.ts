import { _decorator, Component, Button, RichText } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ResultsPanelView')
export class ResultsPanelView extends Component
{
    @property(RichText)
    public ResultsText: RichText = null!;

    @property(Button)
    public PlayAgainButton: Button = null!;

    public onPlayAgainClicked: (() => void) | null = null;

    protected onLoad(): void
    {
        this.PlayAgainButton.node.on(Button.EventType.CLICK, this.handlePlayAgainClick, this);
    }

    private handlePlayAgainClick(): void
    {
        this.onPlayAgainClicked?.();
    }

    public show(score: number, total: number): void
    {
        this.node.active = true;
        this.ResultsText.string =
            `<color=#ffffff><b>Quiz Finished!</b></color><br/>` +
            `<color=#ffdd44>Score: ${score} / ${total}</color>`;
    }

    public setPlayAgainInteractable(value: boolean): void
    {
        if (this.PlayAgainButton?.isValid)
        {
            this.PlayAgainButton.interactable = value;
        }
    }

    public setActive(value: boolean): void
    {
        this.node.active = value;
    }

    public unbind(): void
    {
        this.PlayAgainButton?.node.off(Button.EventType.CLICK, this.handlePlayAgainClick, this);
        this.onPlayAgainClicked = null;
    }
}

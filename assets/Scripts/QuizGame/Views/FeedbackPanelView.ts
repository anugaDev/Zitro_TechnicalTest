import { _decorator, Component, Button, RichText, Node, UIOpacity } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('FeedbackPanelView')
export class FeedbackPanelView extends Component
{
    @property(RichText)
    public FeedbackText: RichText = null!;

    @property(Button)
    public NextButton: Button = null!;

    public onNextClicked: (() => void) | null = null;

    protected onLoad(): void
    {
        this.NextButton.node.on(Button.EventType.CLICK, this.handleNextClick, this);
    }

    private handleNextClick(): void
    {
        this.onNextClicked?.();
    }

    public show(wasCorrect: boolean, correctText: string): void
    {
        this.node.active = true;
        this.resetOpacity(this.node);
        this.FeedbackText.string = wasCorrect
            ? '<color=#44ff44><b>✓ Correct!</b></color>'
            : `<color=#ff4444><b>✗ Wrong!</b></color><br/>` +
            `<color=#ffffff>Correct answer: ${correctText}</color>`;
    }

    public setNextInteractable(value: boolean): void
    {
        if (this.NextButton?.isValid)
        {
            this.NextButton.interactable = value;
        }
    }

    public setActive(value: boolean): void
    {
        this.node.active = value;
    }

    public unbind(): void
    {
        this.NextButton?.node.off(Button.EventType.CLICK, this.handleNextClick, this);
        this.onNextClicked = null;
    }

    private resetOpacity(node: Node): void
    {
        const uiOpacity = node.getComponent(UIOpacity);
        if (uiOpacity)
        {
            uiOpacity.opacity = 255;
        }
        node.children.forEach(child => this.resetOpacity(child));
    }
}

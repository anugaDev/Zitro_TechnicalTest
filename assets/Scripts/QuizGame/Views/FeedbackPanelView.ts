import { _decorator, Component, Button, RichText, Node, UIOpacity, Color } from 'cc';
import { ColorUtils } from '../../Core/Utils/ColorUtils';

const { ccclass, property } = _decorator;

@ccclass('FeedbackPanelView')
export class FeedbackPanelView extends Component {
    @property(RichText)
    public FeedbackText: RichText = null!;

    @property(Button)
    public NextButton: Button = null!;

    @property({ type: String })
    public correctLabel: string = '\u2713 Correct!';

    @property({ type: String })
    public wrongLabel: string = '\u2717 Wrong!';

    @property({ type: String })
    public correctAnswerPrefix: string = 'Correct answer: ';

    @property(Color)
    public correctColor: Color = new Color(68, 255, 68, 255);

    @property(Color)
    public wrongColor: Color = new Color(255, 68, 68, 255);

    @property(Color)
    public correctAnswerColor: Color = new Color(255, 255, 255, 255);

    public onNextClicked: (() => void) | null = null;

    protected onLoad(): void {
        this.NextButton.node.on(Button.EventType.CLICK, this.handleNextClick, this);
    }

    private handleNextClick(): void {
        this.onNextClicked?.();
    }

    public show(wasCorrect: boolean, correctText: string): void {
        this.node.active = true;
        this.resetOpacity(this.node);

        if (wasCorrect) {
            this.FeedbackText.string = this.getCorrectText();
        }
        else {
            this.FeedbackText.string = this.getWrongText(correctText);
        }
    }

    private getCorrectText(): string {
        return `<color=${ColorUtils.toHex(this.correctColor)}><b>${this.correctLabel}</b></color>`;
    }

    private getWrongText(correctText: string): string {
        return `<color=${ColorUtils.toHex(this.wrongColor)}><b>${this.wrongLabel}</b></color><br/>` +
               `<color=${ColorUtils.toHex(this.correctAnswerColor)}>${this.correctAnswerPrefix}${correctText}</color>`;
    }

    public setNextInteractable(value: boolean): void {
        if (this.NextButton?.isValid) {
            this.NextButton.interactable = value;
        }
    }

    public setActive(value: boolean): void {
        this.node.active = value;
    }

    public unbind(): void {
        this.NextButton?.node.off(Button.EventType.CLICK, this.handleNextClick, this);
        this.onNextClicked = null;
    }

    private resetOpacity(node: Node): void {
        const uiOpacity = node.getComponent(UIOpacity);
        if (uiOpacity) {
            uiOpacity.opacity = 255;
        }
        node.children.forEach(child => this.resetOpacity(child));
    }
}

import { _decorator, Component, Label, Button, RichText } from 'cc';
import { IMainMenuView } from './IMainMenuView';

const { ccclass, property } = _decorator;

@ccclass('MenuView')
export class MainMenuView extends Component implements IMainMenuView {
    @property(RichText)
    public ClockText: RichText = null!

    @property(Button)
    public QuizButton: Button = null!;

    @property(Button)
    public SlotButton: Button = null!;

    public updateClock(time: string): void {
        this.ClockText.string = time;
    }

    public setButtonsInteractable(value: boolean): void {
        this.QuizButton.interactable = value;
        this.SlotButton.interactable = value;
    }

    public bindQuizButton(handler: () => void): void {
        this.QuizButton.node.on(Button.EventType.CLICK, handler, this);
    }

    public bindSlotButton(handler: () => void): void {
        this.SlotButton.node.on(Button.EventType.CLICK, handler, this);
    }

    public unbindAll(): void {
        if (this.QuizButton && this.QuizButton.node)
        {
            this.QuizButton.node.off(Button.EventType.CLICK);
        }
        if (this.SlotButton && this.SlotButton.node)
        {
            this.SlotButton.node.off(Button.EventType.CLICK);
        }
    }
}
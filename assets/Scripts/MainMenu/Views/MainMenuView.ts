import { _decorator, Component, Button, RichText } from 'cc';
import { IMainMenuView } from './IMainMenuView';
import { AnimationController } from 'db://assets/Scripts/Core/Animations/AnimationController';
import { FadeInAnimation } from 'db://assets/Scripts/Core/Animations/FadeInAnimation';
import { FadeOutAnimation } from 'db://assets/Scripts/Core/Animations/FadeOutAnimation';

const { ccclass, property } = _decorator;

@ccclass('MenuView')
export class MainMenuView extends Component implements IMainMenuView {

    @property(RichText)
    public ClockText: RichText = null!;

    @property(Button)
    public QuizButton: Button = null!;

    @property(Button)
    public SlotButton: Button = null!;

    private _animations: AnimationController = null!;

    protected onLoad(): void {
        this._animations = new AnimationController([
            new FadeInAnimation ('fadeIn',  this.node, 0.5),
            new FadeOutAnimation('fadeOut', this.node, 0.5),
        ]);
    }

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

    public playFadeIn(onFinished: () => void): void {
        this._animations.onFinished = () => onFinished();
        this._animations.play('fadeIn');
    }

    public playFadeOut(onFinished: () => void): void {
        this.setButtonsInteractable(false);
        this._animations.onFinished = () => onFinished();
        this._animations.play('fadeOut');
    }

    public unbindAll(): void {
        if (this.QuizButton?.isValid) {
            this.QuizButton.node.off(Button.EventType.CLICK);
        }
        if (this.SlotButton?.isValid) {
            this.SlotButton.node.off(Button.EventType.CLICK);
        }
    }
}
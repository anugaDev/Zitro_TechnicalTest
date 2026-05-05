export interface IMainMenuView
{
    initialize(): void;

    updateClock(time: string): void;

    setButtonsInteractable(value: boolean): void;

    bindQuizButton(handler: () => void): void;

    bindSlotButton(handler: () => void): void;

    bindExitButton(handler: () => void): void;

    playFadeIn(onFinished: () => void): void;

    playFadeOut(onFinished: () => void): void;

    unbindAll(): void;

    setExitButtonVisible(visible: boolean): void;
}
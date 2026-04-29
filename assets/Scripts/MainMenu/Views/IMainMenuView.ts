export interface IMainMenuView
{
    updateClock(time: string): void;

    setButtonsInteractable(value: boolean): void;

    bindQuizButton(handler: () => void): void;

    bindSlotButton(handler: () => void): void;

    unbindAll(): void;
}
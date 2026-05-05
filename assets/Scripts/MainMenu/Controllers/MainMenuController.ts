import { IMainMenuModel } from '../Models/IMainMenuModel';
import { IMainMenuView } from '../Views/IMainMenuView';

export class MainMenuController
{
    private _disposed: boolean = false;
    constructor(
        private readonly model: IMainMenuModel,
        private readonly view: IMainMenuView
    ) {}

    public init(): void
    {
        this.view.initialize();
        this.view.setButtonsInteractable(false);
        this.view.setExitButtonVisible(this.model.canQuit());
        this.initClock();
        this.view.playFadeIn(() => this.setSceneInteractable());
    }

    private initClock(): void
    {
        this.model.initializeTime();
        this.view.updateClock(this.model.getCurrentTime());
        this.model.startClock((time) => this.view.updateClock(time));
    }

    private setSceneInteractable(): void
    {
        this.view.setButtonsInteractable(true);
        this.view.bindQuizButton(this.onGoToQuiz.bind(this));
        this.view.bindSlotButton(this.onGoToSlot.bind(this));
        this.view.bindExitButton(this.onExit.bind(this));
    }

    public dispose(): void
    {
        if (this._disposed) return;
        this._disposed = true;
        this.model.stopClock();
        this.view.unbindAll();
        this.view.setButtonsInteractable(false);
    }

    private onGoToQuiz(): void
    {
        this.view.playFadeOut(this.onFadeToQuiz.bind(this));
    }

    private onFadeToQuiz(): void
    {
        this.dispose();
        this.model.goToQuiz();
    }

    private onGoToSlot(): void
    {
        this.view.playFadeOut(this.onFadeToSlot.bind(this));
    }

    private onFadeToSlot(): void
    {
        this.dispose();
        this.model.goToSlot();
    }

    private onExit(): void
    {
        this.view.playFadeOut(this.onFadeToExit.bind(this));
    }

    private onFadeToExit(): void
    {
        this.dispose();
        this.model.quit();
    }
}
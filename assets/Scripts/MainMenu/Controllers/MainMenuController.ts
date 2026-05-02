import { IMainMenuModel } from '../Models/IMainMenuModel';
import { IMainMenuView } from '../Views/IMainMenuView';

export class MainMenuController
{
    constructor
    (
        private readonly model: IMainMenuModel,

        private readonly view: IMainMenuView
    ) {}

    public async init(): Promise<void>
    {
        this.view.setButtonsInteractable(false);
        await this.initClock();
        this.view.playFadeIn(() => this.setSceneInteractable());
    }

    private async initClock(): Promise<void>
    {
        try {
            await this.model.initializeTime();
        } catch (e) {
            console.warn('WorldTimeAPI unreachable, falling back to local time.', e);
        }

        this.view.updateClock(this.model.getFormattedTime());
        this.model.startClock((time) => this.view.updateClock(time));
    }

    private setSceneInteractable(): void
    {
        this.view.setButtonsInteractable(true);
        this.view.bindQuizButton(this.onGoToQuiz.bind(this));
        this.view.bindSlotButton(this.onGoToSlot.bind(this));
    }

    public dispose(): void
    {
        this.model.stopClock();
        this.view.unbindAll();
        this.view.setButtonsInteractable(false);
    }

    private onGoToQuiz(): void
    {
        this.dispose();
        this.model.goToQuiz();
    }

    private onGoToSlot(): void
    {
        this.dispose();
        this.model.goToSlot();
    }
}
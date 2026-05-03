import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';
import { IMainMenuModel } from '../Models/IMainMenuModel';
import { IMainMenuView } from '../Views/IMainMenuView';

export class MainMenuController {

    public onApiResult: ((result: ApiResult<Date>) => void) | null = null;

    constructor(
        private readonly model: IMainMenuModel,
        private readonly view: IMainMenuView
    ) {}

    public async init(): Promise<void> {
        this.view.setButtonsInteractable(false);
        await this.initClock();
        this.view.playFadeIn(() => this.setSceneInteractable());
    }

    private async initClock(): Promise<void> {
        this.onApiResult?.(ApiResult.loading<Date>());

        const result = await this.model.initializeTime();

        this.onApiResult?.(
            ApiResult.isError(result)
                ? ApiResult.error<Date>('Usando hora local')
                : result
        );

        this.view.updateClock(this.model.getFormattedTime());
        this.model.startClock((time) => this.view.updateClock(time));
    }

    private setSceneInteractable(): void {
        this.view.setButtonsInteractable(true);
        this.view.bindQuizButton(this.onGoToQuiz.bind(this));
        this.view.bindSlotButton(this.onGoToSlot.bind(this));
    }

    public dispose(): void {
        this.model.stopClock();
        this.view.unbindAll();
        this.view.setButtonsInteractable(false);
    }

    private onGoToQuiz(): void {
        this.view.playFadeOut(() => {
            this.dispose();
            this.model.goToQuiz();
        });
    }

    private onGoToSlot(): void {
        this.view.playFadeOut(() => {
            this.dispose();
            this.model.goToSlot();
        });
    }
}
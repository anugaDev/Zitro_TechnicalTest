import {GlobalParameters} from "db://assets/Scripts/GlobalParameters";
import { ISceneNavigator } from '../../Core/ISceneNavigator';
import { IMainMenuModel } from '../Models/IMainMenuModel';
import { IMainMenuView } from '../Views/IMainMenuView';

export class MainMenuController
{
    constructor
    (
        private readonly navigator: ISceneNavigator,

        private readonly model: IMainMenuModel,

        private readonly view: IMainMenuView
    ) {}

    public init(): void
    {
        this.view.updateClock(this.model.getFormattedTime());

        this.view.bindQuizButton(this.onGoToQuiz.bind(this));
        this.view.bindSlotButton(this.onGoToSlot.bind(this));

        this.model.startClock((time) => this.view.updateClock(time));
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
        this.navigator.goTo(GlobalParameters.SCENE_QUIZ);
    }

    private onGoToSlot(): void
    {
        this.dispose();
        this.navigator.goTo(GlobalParameters.SCENE_SLOT);
    }
}
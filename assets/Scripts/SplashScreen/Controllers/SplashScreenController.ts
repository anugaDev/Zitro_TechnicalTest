import { GlobalParameters } from "db://assets/Scripts/GlobalParameters";
import { ISplashScreenModel } from '../Models/ISplashScreenModel';
import { SplashScreenModel } from '../Models/SplashScreenModel';
import { ISceneNavigator } from '../../Core/ISceneNavigator';
import { ISplashScreenView } from '../Views/ISplashScreenView';

export class SplashScreenController
{
    constructor
    (
        private readonly navigator: ISceneNavigator,

        private readonly model: ISplashScreenModel,

        private readonly view: ISplashScreenView
    ) {}

    public init(): void
    {
        this.model.onProgressChangedEvent = (current) =>
            this.view.setProgressBar(current)
        this.model.onLoadedEvent = () => this.onGoToMainMenu();
        this.model.startLoadProcess();
    }

    public dispose(): void
    {
        this.view.unbindAll();
    }

    private onGoToMainMenu(): void
    {
        this.dispose();
        this.navigator.goTo(GlobalParameters.SCENE_MENU);
    }
}
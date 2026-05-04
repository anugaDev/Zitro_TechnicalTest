import { GlobalParameters } from '../../GlobalParameters';
import { ISplashScreenModel } from '../Models/ISplashScreenModel';
import { ISceneNavigator } from '../../Core/SceneNavigator/ISceneNavigator';
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
        this.view.initialize();
        this.model.onProgressChangedEvent = (current) =>
            this.view.setProgressBar(current);
        this.model.onAssetStatusChangedEvent = (result) =>
            this.view.showAssetStatus(result);
        this.model.onStartingGameEvent = () =>
            this.view.showStartingGame();
        this.model.onStandByEvent = () =>
            this.view.showStandBy();
        this.model.onLoadedEvent = () => this.onGoToMainMenu();
        this.model.startLoadProcess();
    }

    public dispose(): void
    {
        this.view.unbindAll();
    }

    private onGoToMainMenu(): void
    {
        this.view.playFadeOut(() =>
        {
            this.dispose();
            this.navigator.goTo(GlobalParameters.SCENE_MENU);
        });
    }
}
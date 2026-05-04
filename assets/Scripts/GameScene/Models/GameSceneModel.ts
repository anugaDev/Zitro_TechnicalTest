import { GlobalParameters } from '../../GlobalParameters';
import { ISceneNavigator } from '../../Core/ISceneNavigator';
import { IGameSceneModel } from './IGameSceneModel';

export class GameSceneModel implements IGameSceneModel
{
    constructor(private readonly navigator: ISceneNavigator) {}

    public goToMenu(): void
    {
        this.navigator.goTo(GlobalParameters.SCENE_MENU);
    }
}

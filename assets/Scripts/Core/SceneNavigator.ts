import {director} from 'cc';
import {ISceneNavigator} from './ISceneNavigator';

export class SceneNavigator implements ISceneNavigator
{
    public goTo(sceneName: string): void
    {
        director.loadScene(sceneName);
    }
}
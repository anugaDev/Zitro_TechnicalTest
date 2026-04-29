import {director} from 'cc';
import {ISceneNavigator} from "db://assets/Scripts/Core/ISceneNavigator";

export class SceneNavigator implements ISceneNavigator
{
    public goTo(sceneName: string): void
    {
        director.loadScene(sceneName);
    }
}
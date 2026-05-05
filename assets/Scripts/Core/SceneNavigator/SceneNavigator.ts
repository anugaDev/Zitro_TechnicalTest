import { director, game, system } from 'cc';
import { ISceneNavigator } from './ISceneNavigator';

export class SceneNavigator implements ISceneNavigator
{
    public goTo(sceneName: string): void
    {
        director.loadScene(sceneName);
    }

    public quit(): void
    {
        if (!system.isNative)
        {
            return;
        }

        game.end();
    }

    public canQuit(): boolean
    {
        return system.isNative;
    }
}
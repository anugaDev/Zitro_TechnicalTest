export interface ISceneNavigator
{
    goTo(sceneName: string): void;

    quit(): void;
}
export interface IGameSceneView
{
    initialize(): void;

    onExitPressed: (() => void) | null;

    playFadeIn(onFinished: () => void): void;

    playFadeOut(onFinished: () => void): void;

    unbind(): void;
}
import { IGameSceneModel } from '../Models/IGameSceneModel';
import { IGameSceneView } from '../Views/IGameSceneView';

export class GameSceneController
{
    public onFadeInCompleted: (() => void) | null = null;

    public onFadeOutStarted: (() => void) | null = null;

    constructor(
        private readonly model: IGameSceneModel,
        private readonly view: IGameSceneView
    ) {}

    public init(): void
    {
        this.view.initialize();
        this.view.onExitPressed = () => this.onExit();
        this.view.playFadeIn(() => this.onFadeInCompleted?.());
    }

    public dispose(): void
    {
        this.view.unbind();
    }

    private onExit(): void
    {
        this.onFadeOutStarted?.();
        this.view.playFadeOut(() =>
        {
            this.dispose();
            this.model.goToMenu();
        });
    }
}

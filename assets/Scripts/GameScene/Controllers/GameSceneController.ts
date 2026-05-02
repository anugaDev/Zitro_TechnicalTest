import { IGameSceneModel } from '../Models/IGameSceneModel';
import { IGameSceneView } from '../Views/IGameSceneView';

export class GameSceneController {

    constructor(
        private readonly model: IGameSceneModel,

        private readonly view: IGameSceneView
    ) {}

    public init(): void {
        this.view.onExitPressed = () => this.onExit();
        this.view.playFadeIn(() => {});
    }

    public dispose(): void {
        this.view.unbind();
    }

    private onExit(): void {
        this.view.playFadeOut(() => {
            this.dispose();
            this.model.goToMenu();
        });
    }
}

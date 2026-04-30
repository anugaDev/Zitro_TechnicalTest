export interface IGameSceneView {

    onExitPressed: (() => void) | null;

    unbind(): void;
}
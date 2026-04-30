import { _decorator, Component, Button } from 'cc';
import { IGameSceneView } from './IGameSceneView';

const { ccclass, property } = _decorator;

@ccclass('GameSceneView')
export class GameSceneView extends Component implements IGameSceneView {

    @property(Button)
    public ExitButton: Button = null!;

    public onExitPressed: (() => void) | null = null;

    protected onLoad(): void {
        this.ExitButton.node.on(Button.EventType.CLICK, this.handleExitClick, this);
    }

    protected onDestroy(): void {
        this.unbind();
    }

    public unbind(): void {
        if (this.ExitButton?.isValid) {
            this.ExitButton.node.off(Button.EventType.CLICK, this.handleExitClick, this);
        }
        this.onExitPressed = null;
    }

    private handleExitClick(): void {
        this.onExitPressed?.();
    }
}

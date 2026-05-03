import { _decorator, Component, Node, Label, Color, UITransform, director } from 'cc';
import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';

const { ccclass, property } = _decorator;

@ccclass('ApiStatusView')
export class ApiStatusView extends Component {

    @property(Node)
    public LoadingNode: Node = null!;

    @property(Node)
    public ErrorNode: Node = null!;

    @property(Label)
    public ErrorLabel: Label = null!;

    @property
    public DebugMode: boolean = false;

    private _debugLabel: Label | null = null;

    protected onLoad(): void {
        this.setLoading(false);
        this.setError(false);

        if (this.DebugMode) {
            this._debugLabel = this.createDebugLabel();
            this.updateDebugLabel('idle', '');
        }
    }

    public onApiResult<T>(result: ApiResult<T>): void {
        this.setLoading(result.status === 'loading');
        this.setError(result.status === 'error');

        if (result.status === 'error' && this.ErrorLabel) {
            this.ErrorLabel.string = result.message;
        }

        if (this.DebugMode) {
            const msg = result.status === 'error' ? result.message : '';
            this.updateDebugLabel(result.status, msg);
        }

        console.log(`[ApiStatusView] status=${result.status}` +
            (result.status === 'error' ? ` | message="${result.message}"` : ''));
    }

    private setLoading(active: boolean): void {
        if (this.LoadingNode) this.LoadingNode.active = active;
    }

    private setError(active: boolean): void {
        if (this.ErrorNode) this.ErrorNode.active = active;
    }

    private createDebugLabel(): Label {
        const node = new Node('__ApiStatusDebug__');
        node.layer = this.node.layer;

        const scene = director.getScene();
        const canvas = scene?.getChildByName('Canvas') ?? this.node;
        canvas.addChild(node);

        const transform = node.addComponent(UITransform);
        transform.setContentSize(800, 60);

        const label = node.addComponent(Label);
        label.fontSize  = 28;
        label.isBold    = true;
        label.overflow  = Label.Overflow.RESIZE_HEIGHT;

        return label;
    }

    private updateDebugLabel(status: string, message: string): void {
        if (!this._debugLabel) return;

        const ts = new Date().toLocaleTimeString();

        const statusMap: Record<string, { text: string; color: Color }> = {
            idle: { text: `[${ts}] ⬜ API: idle`, color: new Color(200, 200, 200, 255) },
            loading: { text: `[${ts}] 🔄 API: loading…`, color: new Color(255, 220,  50, 255) },
            success: { text: `[${ts}] ✅ API: success`, color: new Color( 80, 220,  80, 255) },
            error: { text: `[${ts}] ❌ API: error — ${message}`,  color: new Color(255,  80,  80, 255) },
        };

        const entry = statusMap[status] ?? statusMap['idle'];
        this._debugLabel.string = entry.text;
        this._debugLabel.color  = entry.color;
    }
}

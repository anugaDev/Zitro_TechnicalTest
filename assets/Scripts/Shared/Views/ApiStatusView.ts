import { _decorator, Component, Node, Label, Color, UITransform, director } from 'cc';
import { ApiResult } from 'db://assets/Scripts/Shared/ApiResult';

const { ccclass, property } = _decorator;

@ccclass('ApiStatusView')
export class ApiStatusView extends Component {

    private static readonly DEBUG_NODE_NAME = '__ApiStatusDebug__';

    private static readonly CANVAS_NODE_NAME = 'Canvas';

    private static readonly DEBUG_FONT_SIZE = 28;

    private static readonly DEBUG_LABEL_WIDTH = 800;

    private static readonly DEBUG_LABEL_HEIGHT = 60;

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
            const message = result.status === 'error' ? result.message : '';
            this.updateDebugLabel(result.status, message);
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
        const node = new Node(ApiStatusView.DEBUG_NODE_NAME);
        node.layer = this.node.layer;

        const scene = director.getScene();
        const canvas = scene?.getChildByName(ApiStatusView.CANVAS_NODE_NAME) ?? this.node;
        canvas.addChild(node);

        const transform = node.addComponent(UITransform);
        transform.setContentSize(ApiStatusView.DEBUG_LABEL_WIDTH, ApiStatusView.DEBUG_LABEL_HEIGHT);

        const label = node.addComponent(Label);
        label.fontSize = ApiStatusView.DEBUG_FONT_SIZE;
        label.isBold = true;
        label.overflow = Label.Overflow.RESIZE_HEIGHT;

        return label;
    }

    private updateDebugLabel(status: string, message: string): void {
        if (!this._debugLabel) return;

        const timestamp = new Date().toLocaleTimeString();

        const statusMap: Record<string, { text: string; color: Color }> = {
            idle: { text: `[${timestamp}] ⬜ API: idle`, color: new Color(200, 200, 200, 255) },
            loading: { text: `[${timestamp}] 🔄 API: loading…`, color: new Color(255, 220, 50, 255) },
            success: { text: `[${timestamp}] ✅ API: success`, color: new Color(80, 220, 80, 255) },
            error: { text: `[${timestamp}] ❌ API: error — ${message}`, color: new Color(255, 80, 80, 255) },
        };

        const entry = statusMap[status] ?? statusMap['idle'];
        this._debugLabel.string = entry.text;
        this._debugLabel.color = entry.color;
    }
}
